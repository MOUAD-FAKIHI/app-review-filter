import React, { useEffect, useState } from 'react';
import review from '../review.js';
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap';
import Rating from '../components/Rating';
// import { Link } from 'react-router-dom';

export const ratings = [
  {
    name: '5stars & up',
    rating: 5,
  },
  {
    name: '4stars & up',
    rating: 4,
  },

  {
    name: '3stars & up',
    rating: 3,
  },

  {
    name: '2stars & up',
    rating: 2,
  },

  {
    name: '1stars & up',
    rating: 1,
  },
];
export default function AppReviewsScreen() {
  const versions = [
    ...new Set(review.map((e) => e.version.replace(/[vV]/g, ''))),
  ];
  const [reviewData, setReviewData] = useState([]);
  const countries = [...new Set(review.map((e) => e.countryName))];
  const apps = [...new Set(review.map((e) => e.appStoreName).sort())];
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState();
  const [filterApps, setFilterApps] = useState(apps[0]);
  const [filterNewOld, setFilterNewOld] = useState('newest');
  const [filterSearchKeyword, setFilterSearchKeyword] = useState('');
  const [filterReviewDate, setFilterReviewDate] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterVersion, setFilterVersion] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  // console.log(filterApps);
  //   console.log(pages);
  //   console.log(versions);
  //   console.log(countries);
  const dateConverter = (dateTimeString) => {
    // Convert the string to a Date object
    let dateTime = new Date(dateTimeString);

    // Get the current date and time
    let currentDate = new Date();

    // Calculate the time difference in milliseconds
    let timeDifference = currentDate - dateTime;

    // Convert milliseconds to seconds, minutes, hours, days, weeks, months, and years
    let seconds = Math.floor(timeDifference / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let weeks = Math.floor(days / 7);
    let months = Math.floor(days / 30);
    let years = Math.floor(days / 365);

    // Determine the appropriate format based on the time difference
    let formattedTime;
    if (years > 0) {
      formattedTime = years + ' year' + (years > 1 ? 's' : '') + ' ago';
    } else if (months > 0) {
      formattedTime = months + ' month' + (months > 1 ? 's' : '') + ' ago';
    } else if (weeks > 0) {
      formattedTime = weeks + ' week' + (weeks > 1 ? 's' : '') + ' ago';
    } else if (days > 0) {
      formattedTime = days + ' day' + (days > 1 ? 's' : '') + ' ago';
    } else if (hours > 0) {
      formattedTime = hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
    } else {
      formattedTime = minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
    }

    return formattedTime;
  };
  useEffect(() => {
    const prepareData = () => {
      let data = review.filter((e) => e.appStoreName === filterApps);
      //sorting
      if (filterNewOld === 'newest')
        data = data.sort((a, b) => {
          const dateA = new Date(a.reviewDate);
          const dateB = new Date(b.reviewDate);
          return dateB - dateA;
        });
      else
        data.sort((a, b) => {
          const dateA = new Date(a.reviewDate);
          const dateB = new Date(b.reviewDate);
          return dateA - dateB;
        });
      // filtering
      // with keyword search
      if (filterSearchKeyword !== '')
        data = data.filter((review) => {
          // Convert all review properties to lowercase for case-insensitive search
          const reviewValues = Object.values(review).map((value) =>
            typeof value === 'string' ? value.toLowerCase() : value
          );

          // Check if the keyword is present in any review property
          return reviewValues.some((value) => {
            if (typeof value === 'string') {
              return value.includes(filterSearchKeyword.toLowerCase());
            }
            return false;
          });
        });
      // with date
      if (filterReviewDate !== '')
        data = data.filter((e) =>
          dateConverter(e.reviewDate).includes(dateConverter(filterReviewDate))
        );
      // with rating
      if (filterRating !== 'all')
        data = data.filter((e) => e.rating === `${filterRating}`);
      // with version
      if (filterVersion !== 'all')
        data = data.filter(
          (e) =>
            e.version === `V${filterVersion}` ||
            e.version === `v${filterVersion}` ||
            e.version === `${filterVersion}`
        );
      // with contry
      if (filterCountry !== 'all')
        data = data.filter((e) => e.countryName === filterCountry);
      setPages(Math.ceil(data.length / 10));
      setReviewData(data.slice((page - 1) * 10, page * 10));
    };
    prepareData();
  }, [
    page,
    filterRating,
    filterCountry,
    filterVersion,
    filterApps,
    filterNewOld,
    filterReviewDate,
    filterSearchKeyword,
  ]);

  return (
    <div className="p-3">
      <Row className="p-2 mb-4">
        <Col xs={4} md={2}>
          <Form.Group>
            <Form.Label>Select products</Form.Label>
            <Form.Select
              onChange={(e) => {
                setFilterApps(e.target.value);
              }}
            >
              {apps.map((e) => (
                <option value={e} key={e}>
                  {e}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={{ span: 4, offset: 2 }} md={{ span: 2, offset: 6 }}>
          <Form.Group>
            <Form.Label>Sorting</Form.Label>
            <Form.Select
              onChange={(e) => {
                setFilterNewOld(e.target.value);
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row className="position-relative border-top heightAllElem">
        <Col className="border-end" xs={4} md={3}>
          <div className="p-4 sticky-top">
            <div className="mb-2">
              <Form.Group controlId="filterSearch">
                <Form.Control
                  type="text"
                  name="filterSearch"
                  placeholder="Search"
                  value={filterSearchKeyword}
                  onChange={(e) => {
                    setFilterSearchKeyword(e.target.value);
                  }}
                />
              </Form.Group>
            </div>
            <div className="mb-2">
              <Form.Group controlId="filterDate">
                <Form.Control
                  type="date"
                  name="filterDate"
                  value={filterReviewDate}
                  onChange={(e) => {
                    setFilterReviewDate(e.target.value);
                  }}
                />
              </Form.Group>
            </div>
            <div>
              <h6><i class="fas fa-caret-down"></i> Filter by Rating</h6>
              <ul className="list-unstyled">
                {ratings.map((r) => (
                  <li
                    key={r.name}
                    className={
                      r.rating === filterRating
                        ? 'bg-light flex-wrap d-flex justify-content-between'
                        : 'flex-wrap d-flex justify-content-between'
                    }
                    style={{ cursor: 'pointer' }}
                    onClick={() => setFilterRating(r.rating)}
                  >
                    <span className='text-nowrap'>
                      <Rating rating={r.rating} />{' '}
                    </span>
                    <span>
                      {
                        review.filter(
                          (e) =>
                            e.appStoreName === filterApps &&
                            e.rating === `${r.rating}`
                        ).length
                      }
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h6><i class="fas fa-caret-down"></i> Filter by Version</h6>
              <ul className="list-unstyled">
                {versions.map((r, index) => (
                  <li
                    key={index}
                    className={
                      r === filterVersion
                        ? 'bg-light flex-wrap d-flex justify-content-between'
                        : 'flex-wrap d-flex justify-content-between'
                    }
                    style={{ cursor: 'pointer' }}
                    onClick={() => setFilterVersion(r)}
                  >
                    {r}{' '}
                    <span>
                      {
                        review.filter(
                          (e) =>
                            e.appStoreName === filterApps &&
                            (e.version === `V${r}` ||
                              e.version === `v${r}` ||
                              e.version === `${r}`)
                        ).length
                      }
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h6><i class="fas fa-caret-down"></i> Filter by Country</h6>
              <ul className="list-unstyled">
                {countries.map((r, index) => (
                  <li
                    key={index}
                    className={
                      r === filterCountry
                        ? 'bg-light flex-wrap d-flex justify-content-between'
                        : 'flex-wrap d-flex justify-content-between'
                    }
                    style={{ cursor: 'pointer' }}
                    onClick={() => setFilterCountry(r)}
                  >
                    {r}{' '}
                    <span>
                      {
                        review.filter(
                          (e) =>
                            e.appStoreName === filterApps && e.countryName === r
                        ).length
                      }
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Col>
        <Col className="p-4 position-absolute end-0" xs={8} md={9}>
          {reviewData.map((e) => (
            <Card key={e.id} className="mb-2">
              <Card.Body>
                <Card.Title>
                  <Badge bg="light" text="dark">
                    {e.appStoreName}
                  </Badge>{' '}
                  &nbsp;&nbsp;&nbsp;
                  {e.reviewHeading}&nbsp;&nbsp;&nbsp;{' '}
                  <span className='text-nowrap'>
                    <Rating rating={e.rating} />
                  </span>
                </Card.Title>
                <Card.Text>{e.reviewText}</Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted bg-white border-0">
                <strong>by {e.reviewUserName}&nbsp;&nbsp;&nbsp;</strong>
                <strong>
                  {dateConverter(e.reviewDate)}&nbsp;&nbsp;&nbsp;
                </strong>{' '}
                <strong>{e.version}&nbsp;&nbsp;&nbsp;</strong>
                <strong>{e.countryName}</strong>
              </Card.Footer>
            </Card>
          ))}
          <div className="d-flex overflow-auto scrollBarStyle">
            {[...Array(pages).keys()].map((x) => (
              <Button
                key={x + 1}
                className={
                  Number(page) === x + 1
                    ? 'bg-primary text-white me-2 mb-2'
                    : 'me-2 mb-2'
                }
                onClick={() => setPage(x + 1)}
                variant="light"
              >
                {x + 1}
              </Button>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
}
