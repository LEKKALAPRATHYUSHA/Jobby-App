import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: 'INITIAL',
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: 'LOADING'})

    // ✅ FIX: destructuring props
    const {match} = this.props
    const {id} = match.params

    const jwtToken = Cookies.get('jwt_token')

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    const data = await response.json()

    if (response.ok) {
      // ✅ FIX: camelCase conversion
      const updatedData = {
        jobDetails: {
          id: data.job_details.id,
          title: data.job_details.title,
          rating: data.job_details.rating,
          location: data.job_details.location,
          employmentType: data.job_details.employment_type,
          packagePerAnnum: data.job_details.package_per_annum,
          jobDescription: data.job_details.job_description,
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          skills: data.job_details.skills,
          lifeAtCompany: data.job_details.life_at_company,
        },
        similarJobs: data.similar_jobs.map(each => ({
          id: each.id,
          title: each.title,
          rating: each.rating,
          location: each.location,
          employmentType: each.employment_type,
          jobDescription: each.job_description,
          companyLogoUrl: each.company_logo_url,
        })),
      }

      this.setState({
        jobDetails: updatedData.jobDetails,
        similarJobs: updatedData.similarJobs,
        apiStatus: 'SUCCESS',
      })
    } else {
      this.setState({apiStatus: 'FAILURE'})
    }
  }

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state

    const {
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyLogoUrl,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <div>
        <img src={companyLogoUrl} alt="job details company logo" />
        <h1>{title}</h1>
        <p>{rating}</p>
        <p>{location}</p>
        <p>{employmentType}</p>
        <p>{packagePerAnnum}</p>

        <h1>Description</h1>
        <p>{jobDescription}</p>

        <a href={companyWebsiteUrl}>Visit</a>

        <h1>Skills</h1>
        <ul>
          {skills &&
            skills.map(skill => (
              <li key={skill.name}>
                <img src={skill.image_url} alt={skill.name} />
                <p>{skill.name}</p>
              </li>
            ))}
        </ul>

        <h1>Life at Company</h1>
        <p>{lifeAtCompany && lifeAtCompany.description}</p>
        <img
          src={lifeAtCompany && lifeAtCompany.image_url}
          alt="life at company"
        />

        <h1>Similar Jobs</h1>
        <ul>
          {similarJobs.map(job => (
            <li key={job.id}>
              <img src={job.companyLogoUrl} alt="similar job company logo" />
              <h1>{job.title}</h1>
              <p>{job.rating}</p>
              <p>{job.location}</p>
              <p>{job.employmentType}</p>

              <h1>Description</h1>
              <p>{job.jobDescription}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>

      {/* ✅ FIX: button type added */}
      <button type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <p>Loading...</p>
    </div>
  )

  render() {
    const {apiStatus} = this.state

    let content

    switch (apiStatus) {
      case 'LOADING':
        content = this.renderLoadingView()
        break
      case 'SUCCESS':
        content = this.renderSuccessView()
        break
      case 'FAILURE':
        content = this.renderFailureView()
        break
      default:
        content = null
    }

    return (
      <>
        <Header />
        {content}
      </>
    )
  }
}

export default JobItemDetails
