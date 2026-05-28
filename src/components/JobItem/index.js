import {Link} from 'react-router-dom'

const JobItem = ({details}) => (
  <li>
    <Link to={`/jobs/${details.id}`}>
      <img src={details.company_logo_url} alt="company logo" />
      <h1>{details.title}</h1>
      <p>{details.rating}</p>
      <p>{details.location}</p>
      <p>{details.employment_type}</p>

      <h1>Description</h1>
      <p>{details.job_description}</p>
    </Link>
  </li>
)

export default JobItem
