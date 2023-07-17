import { useState, useEffect } from 'react'
import './VotesButton.css'

export default function VotesButton() {
  const [count, setCount] = useState('?')
  const [error, setError] = useState('')
  const fetchVotesUrl = import.meta.env.VITE_VOTES_API_URL

  const fetchVotes = () => {
    fetch(fetchVotesUrl)
      .then(response => {
        if (!response.ok) {
          throw response
        }
        return response.json()
      })
      .then(data => setCount(data.votes))
      .catch((error: Response) => {
        console.error(error)
        error.json().then(data => {
          setError(`Failed to get votes tally. Response: "${data.message}"`)
        }).catch(() => {
          setError(`Failed to get votes tally: ${error.statusText}`)
        })
        setCount('?')
        setTimeout(() => {
          setError('')
        }, 2000)
      })
  }

    useEffect(() => {
      fetchVotes()
    }, [])

    const handleClick = () => {
      fetchVotes()
      const button = document.querySelector('button')
      button?.classList.add('pulse')
      setTimeout(() => {
        button?.classList.remove('pulse')
      }, 500)
    }

    return (
      <div className='button-container'>
        <button onClick={handleClick} title='Click to refresh'>
          Vote count is {count}
        </button>
        {error && <div className="error">{error}</div>}
      </div>
    )
  }