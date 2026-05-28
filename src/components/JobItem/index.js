import {Link} from 'react-router-dom'

const JobItem = props => {
  const {details} = props

  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    jobDescription,
  } = details

  return (
    <li>
      <Link to={`/jobs/${details.id}`}>
        <img src={companyLogoUrl} alt="company logo" />

        <h1>{title}</h1>

        <p>{rating}</p>

        <p>{location}</p>

        <p>{employmentType}</p>

        <h1>Description</h1>

        <p>{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem
