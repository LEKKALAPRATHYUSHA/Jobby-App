import {Component} from 'react'
import Cookies from 'js-cookie'

import Header from '../Header'
import JobItem from '../JobItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locationsList = [
  {
    locationId: 'Hyderabad',
    label: 'Hyderabad',
  },
  {
    locationId: 'Delhi',
    label: 'Delhi',
  },
]

class Jobs extends Component {
  state = {
    profileData: {},
    jobsList: [],
    employmentType: [],
    salaryRange: '',
    searchInput: '',
    selectedLocations: [],
    profileApiStatus: 'INITIAL',
    jobsApiStatus: 'INITIAL',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({
      profileApiStatus: 'LOADING',
    })

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch('https://apis.ccbp.in/profile', options)

    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileData: updatedData,
        profileApiStatus: 'SUCCESS',
      })
    } else {
      this.setState({
        profileApiStatus: 'FAILURE',
      })
    }
  }

  getJobsData = async () => {
    this.setState({
      jobsApiStatus: 'LOADING',
    })

    const {employmentType, salaryRange, searchInput} = this.state

    const employment = employmentType.join(',')

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employment}&minimum_package=${salaryRange}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    const data = await response.json()

    if (response.ok === true) {
      const updatedJobsList = data.jobs.map(eachJob => ({
        id: eachJob.id,
        title: eachJob.title,
        rating: eachJob.rating,
        companyLogoUrl: eachJob.company_logo_url,
        location: eachJob.location,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        packagePerAnnum: eachJob.package_per_annum,
      }))

      this.setState({
        jobsList: updatedJobsList,
        jobsApiStatus: 'SUCCESS',
      })
    } else {
      this.setState({
        jobsApiStatus: 'FAILURE',
      })
    }
  }

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onClickSearch = () => {
    this.getJobsData()
  }

  onChangeEmploymentType = event => {
    const {employmentType} = this.state

    const isChecked = employmentType.includes(event.target.value)

    const updatedData = isChecked
      ? employmentType.filter(each => each !== event.target.value)
      : [...employmentType, event.target.value]

    this.setState(
      {
        employmentType: updatedData,
      },
      this.getJobsData,
    )
  }

  onChangeSalaryRange = event => {
    this.setState(
      {
        salaryRange: event.target.value,
      },
      this.getJobsData,
    )
  }

  onChangeLocation = event => {
    const {selectedLocations} = this.state

    const {value} = event.target

    let updatedList

    if (selectedLocations.includes(value)) {
      updatedList = selectedLocations.filter(each => each !== value)
    } else {
      updatedList = [...selectedLocations, value]
    }

    this.setState({
      selectedLocations: updatedList,
    })
  }

  renderProfileSuccessView = () => {
    const {profileData} = this.state

    return (
      <div>
        <img src={profileData.profileImageUrl} alt="profile" />

        <h1>{profileData.name}</h1>

        <p>{profileData.shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div>
      <button type="button" onClick={this.getProfileData}>
        Retry
      </button>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobsList, selectedLocations} = this.state

    const filteredJobs =
      selectedLocations.length === 0
        ? jobsList
        : jobsList.filter(each => selectedLocations.includes(each.location))
    if (filteredJobs.length === 0) {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />

          <h1>No Jobs Found</h1>

          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }

    return (
      <ul>
        {filteredJobs.map(each => (
          <JobItem details={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderJobsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />

      <h1>Oops! Something Went Wrong</h1>

      <p>We cannot seem to find the page you are looking for</p>

      <button type="button" onClick={this.getJobsData}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader">
      <p>Loading...</p>
    </div>
  )

  render() {
    const {profileApiStatus, jobsApiStatus} = this.state

    return (
      <>
        <Header />

        <div>
          <div>
            {profileApiStatus === 'LOADING' && this.renderLoader()}

            {profileApiStatus === 'SUCCESS' && this.renderProfileSuccessView()}

            {profileApiStatus === 'FAILURE' && this.renderProfileFailureView()}

            <h1>Type of Employment</h1>

            <ul>
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    value={each.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                  />

                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                </li>
              ))}
            </ul>

            <h1>Salary Range</h1>

            <ul>
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    type="radio"
                    id={each.salaryRangeId}
                    name="salary"
                    value={each.salaryRangeId}
                    onChange={this.onChangeSalaryRange}
                  />

                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                </li>
              ))}
            </ul>

            <h1>Location</h1>

            <ul>
              {locationsList.map(each => (
                <li key={each.locationId}>
                  <input
                    type="checkbox"
                    id={each.locationId}
                    value={each.label}
                    onChange={this.onChangeLocation}
                  />

                  <label htmlFor={each.locationId}>{each.label}</label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <input type="search" onChange={this.onChangeSearchInput} />

            <button
              type="button"
              data-testid="searchButton"
              onClick={this.onClickSearch}
            >
              Search
            </button>

            {jobsApiStatus === 'LOADING' && this.renderLoader()}

            {jobsApiStatus === 'SUCCESS' && this.renderJobsSuccessView()}

            {jobsApiStatus === 'FAILURE' && this.renderJobsFailureView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
