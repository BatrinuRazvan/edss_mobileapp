import React from 'react';
import { GoogleLogin } from 'react-google-login';

const clientId = "YOUR_CLIENT_ID.apps.googleusercontent.com"; // Replace with your client ID

const Login = () => {
    const onSuccess = (response) => {
        console.log('Login Success:', response.profileObj);
        // Here you would typically send the token to your backend
        // to verify the token integrity and store the user details
    };

    const onFailure = (response) => {
        console.log('Login Failed:', response);
    };

    return (
        <div>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true} // Automatically sign in users if they are already signed in to Google
            />
        </div>
    );
};

export default Login;
