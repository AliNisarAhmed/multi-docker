import React from 'react';
import axios from 'axios';

const Fib = () => {
  const [ seenIndexes, setSeenIndexes ] = React.useState([]);
  const [ values, setValues ] = React.useState([]);
  const [ index, setIndex ] = React.useState('');

  React.useEffect(() => {
    fetchValues();
    fetchIndexes();

    async function fetchValues() {
      const res = await axios.get('/api/values/current');
      console.log('values from server: ', res.data)
      setValues(res.data);
    }

    async function fetchIndexes() {
      const res = await axios.get('/api/values/all');
      console.log('seen from server: ', res.data)
      setSeenIndexes(res.data);
    }

  }, [])

  return (
    <div>
      <form 
        onSubmit={handleSubmit}
      > 
        <label>Enter your index: </label>
        <input 
          value={index}
          onChange={e => setIndex(e.target.value)}
        /> 
        <button>Submit</button>
      </form>

    <h3>Indexes I have seen: </h3>
      <SeenIndexes seenIndexes={seenIndexes} />
    <h3>Calculated values: </h3>
      <CalculatedValues values={values} />
    </div>
  )

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.post('/api/values', {
      index
    })

    setIndex('')
  }
}

function SeenIndexes({ seenIndexes }) {
  return seenIndexes.map(({ number }) => number).join(', ');
}

function CalculatedValues({ values }) {
  if (!values) {
    return (<p> NO Values yet </p>)
  }
  return Object.entries(values).map(([key, value]) => (
    <div key={key}>
      For index {key} I calculated {value}
    </div>
  ))
}

export default Fib;
