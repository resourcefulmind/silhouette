import './index.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './Login';
import UserAccount from './UserAccount';

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className='container' style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Login /> : <UserAccount key={session.user.id} session={session} />}
    </div>
  );
}

export default App;
