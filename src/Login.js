import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        
        try {
            setLoading(true)
            const { error } = await supabase.auth.signInWithOtp({ email })
            if (error) throw error
            alert('We sent a login link to your email!')
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='row flex-center flex'>
            <div className='col-6 form-widget' aria-live='polite'>
                <h1 className='header'>Silhouette...Be Seen</h1>
                <p> Sign in via magic link with your email below</p>
                {loading ? (
                    'Sending magic link...'
                ): (
                    <form onSubmit={handleLogin}>
                        <label htmlFor='email'>Enter your email</label>
                        <input 
                            id='email' 
                            className='inputField' 
                            type="email" 
                            placeholder="Your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button style={{marginTop: '20px'}}>Send magic link for Login</button>
                    </form>
                )}
            </div>
        </div>
    )
}