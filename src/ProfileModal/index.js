import _ from 'lodash'
import React, { Component } from 'react'
import { Modal, Button, Form, Icon, Search } from 'semantic-ui-react'
import axios from 'axios'
import '../LoginRegisterForm/index.css'

class ProfileModal extends Component {
    constructor(props) {
        super(props)
        const u = props.currentUser || {}
        this.state = {
            username: u.username || '',
            email: u.email || '',
            age: u.age || '',
            school: u.school || '',
            avatar: u.avatar || '',
            address: u.address || '',
            addressResults: [],
            addressLoading: false,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            formData: null,
            uploading: false,
            saving: false,
            error: '',
            success: '',
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, error: '', success: '' })
    }

    handleAddressChange = (e, { value }) => {
        this.setState({ address: value, addressLoading: value.length >= 4 })
        this.searchAddress(value)
    }

    searchAddress = async (query) => {
        if (!query || query.length < 4) { this.setState({ addressResults: [], addressLoading: false }); return }
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=us`,
                { headers: { 'Accept-Language': 'en' } }
            )
            const data = await res.json()
            this.setState({ addressResults: data.map((item, i) => ({ title: item.display_name, key: i })), addressLoading: false })
        } catch { this.setState({ addressLoading: false }) }
    }

    handleAddressSelect = (e, { result }) => this.setState({ address: result.title })

    handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const fd = new FormData()
        fd.append('upload_preset', 'mufasa')
        fd.append('file', file)
        this.setState({ formData: fd })
    }

    deleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/delete`, {
                method: 'DELETE',
                credentials: 'include',
            })
            if (this.props.onDeleted) this.props.onDeleted()
        } catch {
            this.setState({ error: 'Could not delete account. Try again.' })
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const { newPassword, confirmPassword, formData } = this.state

        if (newPassword && newPassword !== confirmPassword) {
            this.setState({ error: 'New passwords do not match.' })
            return
        }

        this.setState({ saving: true, error: '', success: '' })

        let avatarUrl = this.state.avatar
        if (formData) {
            try {
                this.setState({ uploading: true })
                const res = await axios.post('https://api.cloudinary.com/v1_1/mufasa/image/upload', formData)
                avatarUrl = res.data.url
                this.setState({ uploading: false, avatar: avatarUrl })
            } catch {
                this.setState({ error: 'Photo upload failed.', saving: false, uploading: false })
                return
            }
        }

        const body = {
            username: this.state.username,
            email: this.state.email,
            age: this.state.age,
            school: this.state.school,
            avatar: avatarUrl,
            address: this.state.address,
        }
        if (newPassword) {
            body.current_password = this.state.currentPassword
            body.new_password = newPassword
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/profile`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            const json = await res.json()
            if (res.ok) {
                this.setState({ saving: false, success: 'Profile updated!', newPassword: '', confirmPassword: '', currentPassword: '', formData: null })
                if (this.props.onUpdated) this.props.onUpdated(json.data)
            } else {
                this.setState({ saving: false, error: json.message || 'Update failed.' })
            }
        } catch {
            this.setState({ saving: false, error: 'Something went wrong.' })
        }
    }

    render() {
        const { onClose } = this.props
        const { username, email, age, school, avatar, address, addressResults, addressLoading, currentPassword, newPassword, confirmPassword, uploading, saving, error, success } = this.state

        return (
            <Modal open={true} onClose={onClose} size='small'>
                <Modal.Header>
                    <div className='chat-modal-header'>
                        <span>My Profile</span>
                        <Icon name='times' style={{ cursor: 'pointer', opacity: 0.5 }} onClick={onClose} />
                    </div>
                </Modal.Header>

                <Modal.Content scrolling>
                    <Form onSubmit={this.handleSubmit}>

                        {/* Avatar */}
                        <div className='profile-avatar-section'>
                            {avatar
                                ? <img src={avatar} alt='avatar' className='profile-avatar-img' />
                                : <div className='profile-avatar-placeholder'><Icon name='user' size='huge' /></div>
                            }
                            <label className='profile-avatar-upload-btn'>
                                <Icon name='camera' /> Change Photo
                                <input type='file' accept='image/*' style={{ display: 'none' }} onChange={this.handleImageUpload} />
                            </label>
                        </div>

                        <div className='profile-section-label'>Account Info</div>

                        <Form.Field>
                            <label>Username</label>
                            <input name='username' value={username} onChange={this.handleChange} placeholder='Username' />
                        </Form.Field>

                        <Form.Field>
                            <label>Email</label>
                            <input name='email' type='email' value={email} onChange={this.handleChange} placeholder='Email' />
                        </Form.Field>

                        <Form.Group widths='equal'>
                            <Form.Field>
                                <label>Age</label>
                                <input name='age' type='number' value={age} onChange={this.handleChange} placeholder='Age' />
                            </Form.Field>
                            <Form.Field>
                                <label>School</label>
                                <input name='school' value={school} onChange={this.handleChange} placeholder='School' />
                            </Form.Field>
                        </Form.Group>

                        <Form.Field>
                            <label>My Address <span style={{ fontWeight: 400, fontSize: '0.8rem', color: '#9ca3af' }}>(used to calculate distances)</span></label>
                            <Search
                                loading={addressLoading}
                                onResultSelect={this.handleAddressSelect}
                                onSearchChange={_.debounce(this.handleAddressChange, 800, { leading: false })}
                                results={addressResults}
                                value={address}
                                placeholder='Start typing your address...'
                                style={{ width: '100%' }}
                            />
                        </Form.Field>

                        <div className='profile-section-label' style={{ marginTop: 20 }}>Change Password <span style={{ fontWeight: 400, fontSize: '0.8rem', color: '#9ca3af' }}>(leave blank to keep current)</span></div>

                        <Form.Field>
                            <label>Current Password</label>
                            <input name='currentPassword' type='password' value={currentPassword} onChange={this.handleChange} placeholder='Current password' />
                        </Form.Field>

                        <Form.Group widths='equal'>
                            <Form.Field>
                                <label>New Password</label>
                                <input name='newPassword' type='password' value={newPassword} onChange={this.handleChange} placeholder='New password' />
                            </Form.Field>
                            <Form.Field>
                                <label>Confirm New Password</label>
                                <input name='confirmPassword' type='password' value={confirmPassword} onChange={this.handleChange} placeholder='Confirm new password' />
                            </Form.Field>
                        </Form.Group>

                                        {error && <p className='profile-error'>{error}</p>}
                        {success && <p className='profile-success'>{success}</p>}

                        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                            <Button primary type='submit' loading={saving || uploading} style={{ flex: 1 }}>
                                <Icon name='save' /> Save Changes
                            </Button>
                            <Button type='button' color='red' onClick={this.deleteAccount} style={{ flex: 1 }}>
                                <Icon name='trash' /> Delete Account
                            </Button>
                        </div>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}

export default ProfileModal
