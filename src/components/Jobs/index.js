import {Component} from 'react'
import Header from '../Header'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
]

const salaryRangesList = [
  {label: '10 LPA', salaryRangeId: '1000000'},
  {label: '20 LPA', salaryRangeId: '2000000'},
]

class Jobs extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    employmentType: [],
    salaryRange: '',
  }

  componentDidMount() {
    this.getJobsData()
  }

  getJobsData = async () => {
    const {searchInput, employmentType, salaryRange} = this.state

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchInput}`

    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      const updated = data.jobs.map(each => ({
        id: each.id,
        title: each.title,
        jobDescription: each.job_description,
      }))

      this.setState({jobsList: updated})
    }
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobsData()
  }

  onChangeEmployment = event => {
    const {employmentType} = this.state
    const {value} = event.target

    const updated = employmentType.includes(value)
      ? employmentType.filter(e => e !== value)
      : [...employmentType, value]

    this.setState({employmentType: updated}, this.getJobsData)
  }

  onChangeSalary = event => {
    this.setState({salaryRange: event.target.value}, this.getJobsData)
  }

  render() {
    const {jobsList} = this.state

    return (
      <>
        <Header />

        <input type="search" onChange={this.onChangeSearch} />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onClickSearch}
        >
          Search
        </button>

        <h1>Type of Employment</h1>
        <ul>
          {employmentTypesList.map(each => (
            <li key={each.employmentTypeId}>
              <input
                type="checkbox"
                id={each.employmentTypeId}
                value={each.employmentTypeId}
                onChange={this.onChangeEmployment}
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
                name="salary"
                id={each.salaryRangeId}
                value={each.salaryRangeId}
                onChange={this.onChangeSalary}
              />
              <label htmlFor={each.salaryRangeId}>{each.label}</label>
            </li>
          ))}
        </ul>

        <ul>
          {jobsList.map(job => (
            <li key={job.id}>
              <h1>{job.title}</h1>
              <h1>Description</h1>
              <p>{job.jobDescription}</p>
            </li>
          ))}
        </ul>
      </>
    )
  }
}

export default Jobs
