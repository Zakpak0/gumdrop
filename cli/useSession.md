# Next.js Authentication with next-auth

This code snippet is an example of how to implement authentication in a Next.js application using the `next-auth` library. 

## Installation
To use this library, you need to install it first by running the following command:

```bash
npm install next-auth react react-dom
```

## Usage

### Importing Libraries and Enumerations 
The first step is importing necessary libraries and enumerations. In this case, we are importing `useSession` from `"next-auth/react"` and `useRouter` from `"next/router"`. We also define an enumeration called Status that has three possible values: LOADING, AUTHENTICATED, UNAUTHENTICATED.

```javascript
import {useSession} from "next-auth/react"
import {useRouter} from "next/router"

enum Status {
  LOADING = "loading",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}
```

### Defining Home Component 
Next we define our home component which will be rendered when users visit our website's homepage. Inside the component function body we call useRouter() hook provided by Next.js framework for routing purposes.

We then destructure data returned by calling useSession() hook into session object (which contains user information) , status string (which tells us whether user is authenticated or not), update function(which updates session state).

If status equals loading then return a div element containing Loading... text.
If status equals unauthenticated redirect user to sign-in page using router.push method.
Else if status equals authenticated render welcome message along with name of logged in user as well as sign-out button.


```javascript  
export default function Home() {
const router = useRouter()
  const {data: session, status }= useSession()
  
    if (status === Status.LOADING) {
        return <div>Loading...</div>
      }
      if (status === Status.UNAUTHENTICATED) {
        router.push("/api/auth/signin")
        return <div>Redirecting...</div>
      }
      if (status === Status.AUTHENTICATED) {
        return (
          <div>
            <h1>Hello {session.user.name}</h1>
            <button onClick={() => router.push("/api/auth/signout")}>Sign Out</button>
          </div>
        )
    }
}
```

## Conclusion
This code snippet provides a basic example of how to implement authentication in a Next.js application using the `next-auth` library. By following this pattern, you can create secure and user-friendly applications that require authentication.