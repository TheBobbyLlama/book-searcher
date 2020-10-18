import gql from 'graphql-tag';

export const QUERY_ME = gql`
	{
		me {
			savedBooks {
				authors
				description
				title
				image
				bookId
			}
		}
	}
`;