import {Link} from 'react-router-dom'
import Header from '../Header'

const Home = () => (
  <div>
    <Header />
    <h1>Find The Job That Fits Your Life</h1>
    <p>Millions of people are searching for jobs</p>

    <Link to="/jobs">
      <button type="button">Find Jobs</button>
    </Link>
  </div>
)

export default Home
