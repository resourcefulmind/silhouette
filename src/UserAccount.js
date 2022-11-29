// For users to edit their profile details and manage their account.

import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import ProfilePhoto from "./ProfilePhoto";

const UserAccount = ({ session }) => {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [full_name, setFullname] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [current_status, setCurrentStatus] = useState(null)

    useEffect(() => {
        async function getProfile() {
            try {
              setLoading(true)
              const { user } = session
      
              let { data, error } = await supabase
                .from('profiles')
                .select(`username, full_name, website, avatar_url, current_status`)
                .eq('id', user.id)
                .single()
      
              if (error) {
                throw error
              }
      
              setUsername(data.username)
              setFullname(data.full_name)
              setWebsite(data.website)
              setAvatarUrl(data.avatar_url)
            } catch (error) {
              console.warn(error.message)
            } finally {
              setLoading(false)
            }
        }

        getProfile()
    }, [session])


    async function updateProfile({ username, full_name, website, avatar_url, current_status }) {
        try {
            setLoading(true)
            const { user } = session

            const updates = {
                id: user.id, 
                username, 
                full_name, 
                website, 
                avatar_url, 
                current_status, 
                updated_at: new Date(), 
            }

            let { error } = await supabase.from('profiles').upsert(updates)

            if (error) {
                throw error
            }
        } catch (error) {
            alert(error.message)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div aria-live="polite">
            {loading ? (
                'Saving...'
            ) : (
                <form onSubmit={updateProfile} className='form-widget'>
                    <ProfilePhoto 
                        url={avatar_url} 
                        size={150} 
                        onUpload={(url) => {
                            setAvatarUrl(url) 
                            updateProfile({ username, full_name, website, avatar_url: url })
                        }}
                    />
                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="text" value={session.user.email} disabled/>
                    </div>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input 
                            id="username"
                            type="text" 
                            value={username || ''} 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="full_name">Full Name</label>
                        <input 
                            id="full_name"
                            type="text" 
                            value={full_name || ''} 
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="website">Your Website</label>
                        <input 
                            id="website" 
                            type="url" 
                            value= {website || ''} 
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="current_status">How are you really feeling?</label>
                        <input 
                            id="current_status" 
                            type="text" 
                            value= {current_status || ''} 
                            onChange={(e) => setCurrentStatus(e.target.value)}
                        />
                    </div>
                    <div>
                        <button 
                            className="button block primary"
                            onClick={() => updateProfile({ username, full_name, website, avatar_url, current_status })} 
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Update'}
                        </button>
                    </div>
                </form>

            )}
            <button type="button" className="button block" onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
    )
}

export default UserAccount

