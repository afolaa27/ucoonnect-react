

## UConnect



## `Overview`
Uconnect is a book selling app that enables students **sell** books to people that are **close** to them, one of the top priorities for this app is to allow the students to select their schools when signing up and it displays search results based on books that were posted by users in the same school.

### `Technology`
- React
- Flask
- Javascript
- Python
- Sqlite
- Peewee
- Semantic-ui
- Google Maps Api


## WireFrame
![our wireframe](./images/Wireframe1.png)	


## User Story
- User should be able to register and go to feeds for viewing books for sale around them. 
- User should be able to sign in and got to feeds for viewing books for sale around them. 
- User should be able to shortlist books for sale. 
- User should be able to view books for sale around them. 
- User should be able to delete their own listing.
- User should be able to edit their own listing.
- User should be able to adjust the distance of books for sale from them.
- User should be able to favorite books that they plan to buy. 
- User should be able to buy books 
- User should be able to see other buyers profile if they go to the same school.
- User should be able to delete their own account and all their listing. 
- User should be able to change their schools. 
- User should be able to logout. 

## Routes
| Verb | Routes | Function|
|------|--------|---------|
|GET   |/books  |Shows all books|
|------|--------|---------|
|GET   |/users/login|Logs in user|
|------|--------|---------|

## Models
class User(UserMixin,Model){

	username = CharField(unique=True)
	latitude = DecimalField()
	longitude = DecimalField()
	age = IntegerField()
	email = CharField(unique=True)
	password = CharField()
	range = IntegerField()
	school = CharField()
}


class Book(Model){

	title = CharField()
	ISBN = DateTimeField()
	description = TextField()
	created_date = DateTimeField(default=datetime.datetime.now)
	Sold = BooleanField()
	favorite = BooleanField()
	owner = ForeignKeyField(User, backref='Books')
}
class Favorite(Model){
	
	UserId = ForeignKeyField(User, backref='Favorite')
	Book_Id =ForeignKeyField(Book, backref='Favorite')
}











