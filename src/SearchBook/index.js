import React, {Component} from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import FilteredBookList from '../FilteredBookList'
import '../LoginRegisterForm/index.css'

// Fix Leaflet's default marker icon path with webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 100) / 100
}

async function geocode(address) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    if (data && data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch (e) {}
  return null
}

class SearchBook extends Component {
  constructor(props) {
    super(props)
    this.state = {
      books: [],
      filteredBooks: [],
      search: '',
      message: '',
      visible: false,
      showFiltered: false,
      loading: false,
    }
    this.map = null
    this.markers = []
  }

  componentDidMount = async () => {
    await this.getBooks()
    this.initMap()
  }

  componentWillUnmount() {
    if (this.map) { this.map.remove(); this.map = null }
  }

  initMap = async () => {
    const center = await geocode(this.props.userAddress) || { lat: 37.09, lng: -95.71 }
    this.map = L.map(this.mapContainer).setView([center.lat, center.lng], 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map)
  }

  getBooks = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + '/api/v1/books/all', { credentials: 'include' })
      const json = await res.json()
      this.setState({ books: json.data })
    } catch (err) { console.error(err) }
  }

  handleChange = (event) => this.setState({ [event.target.name]: event.target.value })

  clearMarkers = () => {
    this.markers.forEach(m => m.remove())
    this.markers = []
  }

  handleSubmit = async () => {
    if (!this.state.search.trim()) return
    this.setState({ loading: true, showFiltered: false })

    const searchCoords = await geocode(this.state.search)
    if (!searchCoords) {
      this.setState({ visible: true, message: 'Could not find that location.', loading: false })
      setTimeout(() => this.setState({ visible: false }), 3000)
      return
    }

    if (this.map) this.map.setView([searchCoords.lat, searchCoords.lng], 13)
    this.clearMarkers()

    const booksWithDistance = await Promise.all(
      this.state.books.map(async (book) => {
        const coords = await geocode(book.address)
        if (!coords) return null
        const distance = haversineDistance(searchCoords.lat, searchCoords.lng, coords.lat, coords.lng)
        if (this.map) {
          const marker = L.marker([coords.lat, coords.lng])
            .bindPopup(`<strong>${book.title}</strong><br>$${book.price} &bull; ${distance} mi away`)
            .addTo(this.map)
          this.markers.push(marker)
        }
        return { ...book, distance }
      })
    )

    const nearby = booksWithDistance.filter(b => b && b.distance < 10)
    this.setState({
      filteredBooks: nearby,
      showFiltered: true,
      loading: false,
      visible: nearby.length === 0,
      message: 'No books found within 10 miles of that location.',
    })
    if (nearby.length === 0) setTimeout(() => this.setState({ visible: false }), 3000)
  }

  favoriteBook = async (id) => {
    await fetch(process.env.REACT_APP_API_URL + '/api/v1/favorites/' + id, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
  }

  render() {
    return (
      <div className='listContainer'>
        {this.state.visible && (
          <Message size='mini' negative
            header='Location not found'
            content={this.state.message}
          />
        )}

        <div className='search-bar'>
          <Form onSubmit={this.handleSubmit} style={{ display: 'flex', gap: '12px', width: '100%', margin: 0 }}>
            <Input
              name='search'
              value={this.state.search}
              onChange={this.handleChange}
              required
              placeholder='Search by campus name or address...'
              style={{ flex: 1 }}
            />
            <Button primary type='submit' loading={this.state.loading} icon='search'>
              Search
            </Button>
          </Form>
        </div>

        <div className='searchTm'>
          <div ref={el => this.mapContainer = el} className='mapContainer' />
        </div>

        {this.state.showFiltered && (
          <div className='filteredBooks'>
            <FilteredBookList books={this.state.filteredBooks} favorite={this.favoriteBook} openChat={this.props.openChat} />
          </div>
        )}
      </div>
    )
  }
}

export default SearchBook
