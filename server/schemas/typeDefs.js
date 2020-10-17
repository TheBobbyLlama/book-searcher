// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
	input bookInput {
		authors: [String]
		description: String!
		bookId: String!
		image: String
		link: String
		title: String!
	}

	type bookSchema {
		_id: ID
		authors: [String]
		description: String
		bookId: String
		image: String
		link: String
		title: String
	}

	type User {
		_id: ID
		username: String
		email: String
		savedBooks: [bookSchema]
	}

	type Query {
		me: User
	}

	type Mutation {
		login(email: String!, password: String!): Auth
		createUser(username: String!, email: String!, password: String!): Auth
		saveBook(book: bookInput!): User
		deleteBook(bookId: String!): User
	}

	type Auth {
		token: ID!
		user: User
	}
`;

// export the typeDefs
module.exports = typeDefs;