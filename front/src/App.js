import {useCallback, useEffect, useRef, useState} from "react";
import { Col, Row } from "react-bootstrap";
import DepartureBoard from './departure-board';
import axios from "axios";
import { useWindowSize } from 'react-use';
import './App.css';

const MAX_WIDTH = 991;
const MAX_DEG = 45;

const calculateTopScore = teams => {
  const max = teams.reduce((acc, team) => team.score > acc ? team.score : acc, 0);

  const total = teams.reduce((acc, team) => acc + team.score, 0);
  const avg = total / teams.length;

  if (max <= 0) {
    return 0;
  }
  // Jsp trop ce que fait ce calcul, mais ca marche dcp pas toucher lol
  return max + (Math.pow(max, -1) * ((avg < 0 ? avg * -1 : avg) * 5000));
};

const calculateDegrees = (score, topScore) => {
  const deg = score <= 0 ? 0 : (score * (MAX_DEG * 2) / topScore);

  return deg - MAX_DEG;
};

const getTeamPosition = (teams, team) => {
  const orderedScoreTeams = [...teams].sort((a, b) => b.score - a.score);

  for (let i = 0; i < 10; i++) {
    if (orderedScoreTeams[i].id === team.id) {
      return i === 0 ? '1er' : `${i + 1}eme`;
    }
  }
  return '?';
};

const App = () => {
  const { width } = useWindowSize();

  const tvScreenDisplayRef = useRef();
  const tvScreenContentRef = useRef();
  const gaugeBoardTeam1Ref = useRef();
  const gaugeBoardTeam2Ref = useRef();
  const gaugeBoardTeam3Ref = useRef();
  const gaugeBoardTeam4Ref = useRef();

  const [gaugeBoardTeams, setGaugeBoardTeams] = useState({});
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [topScore, setTopScore] = useState(0);
  const [screen, setScreen] = useState('events');

  const scrollDown = () => {
    let timeoutIdScrollTop;

    let intervalId;
    const timeoutIdScrollDown = setTimeout(() => {
      intervalId = setInterval(() => {
        if (tvScreenContentRef.current?.scrollTop + tvScreenContentRef.current?.offsetHeight >= tvScreenContentRef.current?.scrollHeight - 5) {
          clearInterval(intervalId);
          tvScreenDisplayRef.current?.classList.remove('turn-on');
          timeoutIdScrollTop = setTimeout(() => {
            tvScreenDisplayRef.current?.classList.add('turn-on');
            tvScreenContentRef.current?.scrollTo({
              top: 0,
              behavior: 'instant'
            });
            setScreen('teams');
          }, 10000);
          return { timeoutIdScrollTop, timeoutIdScrollDown, intervalId };
        }
        tvScreenContentRef.current?.scrollTo({
          top: tvScreenContentRef.current?.scrollTop + 5,
          behavior: 'smooth'
        });
      }, 100);
    }, 20000);

    return { timeoutIdScrollTop, timeoutIdScrollDown, intervalId };
  };

  useEffect(() => {
    if (screen === 'events') {
      const { timeoutIdScrollTop, timeoutIdScrollDown, intervalId } = scrollDown();
      return () => {
        if (timeoutIdScrollTop) {
          clearTimeout(timeoutIdScrollTop);
        }
        clearTimeout(timeoutIdScrollDown);
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    } else if (screen === 'teams') {
      const removeTurnOnClassTimeoutId = setTimeout(() => {
        tvScreenDisplayRef.current?.classList.remove('turn-on');
      }, 1000);
      const eventsTimeoutId = setTimeout(() => {
        tvScreenDisplayRef.current?.classList.add('turn-on');
        setScreen('events');
      }, 20000);
      return () => {
        clearTimeout(removeTurnOnClassTimeoutId);
        clearTimeout(eventsTimeoutId);
      };
    }
  }, [screen]);

  useEffect(() => {
    const teamBoard1 = new DepartureBoard(gaugeBoardTeam1Ref.current, { letterCount: 6 });
    const teamBoard2 = new DepartureBoard(gaugeBoardTeam2Ref.current, { letterCount: 6 });
    const teamBoard3 = new DepartureBoard(gaugeBoardTeam3Ref.current, { letterCount: 6 });
    const teamBoard4 = new DepartureBoard(gaugeBoardTeam4Ref.current, { letterCount: 6 });
    setGaugeBoardTeams({
      teamBoard1,
      teamBoard2,
      teamBoard3,
      teamBoard4,
    });
  }, []);

  const getData = useCallback(async () => {
    const { data: _teams } = await axios.get(`${process.env.REACT_APP_API_URL}/teams`);
    const { data: _events } = await axios.get(`${process.env.REACT_APP_API_URL}/events`);
    setTeams(_teams);
    setEvents(_events);
  }, []);

  useEffect(() => {
    getData();
    const intervalId = setInterval(getData, 30000);
    const timeoutId = setTimeout(() => {
      window.location.reload(false);
    }, 3600000);
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId)
    };
  }, []);

  useEffect(() => {
    if (!teams.length) return;

    setTopScore(calculateTopScore(teams));
  }, [teams]);

  useEffect(() => {
    if (gaugeBoardTeams?.teamBoard1 && teams?.[0]) {
      gaugeBoardTeams.teamBoard1.setValue(teams[0].score.toString());
    }
    if (gaugeBoardTeams?.teamBoard2 && teams?.[1]) {
      gaugeBoardTeams.teamBoard2.setValue(teams[1].score.toString());
    }
    if (gaugeBoardTeams?.teamBoard3 && teams?.[2]) {
      gaugeBoardTeams.teamBoard3.setValue(teams[2].score.toString());
    }
    if (gaugeBoardTeams?.teamBoard4 && teams?.[3]) {
      gaugeBoardTeams.teamBoard4.setValue(teams[3].score.toString());
    }
  }, [gaugeBoardTeams, teams]);

  useEffect(() => {
    const teamBoard1 = new DepartureBoard(gaugeBoardTeam1Ref.current, { letterCount: 6 });
    const teamBoard2 = new DepartureBoard(gaugeBoardTeam2Ref.current, { letterCount: 6 });
    const teamBoard3 = new DepartureBoard(gaugeBoardTeam3Ref.current, { letterCount: 6 });
    const teamBoard4 = new DepartureBoard(gaugeBoardTeam4Ref.current, { letterCount: 6 });
    setGaugeBoardTeams({
      teamBoard1,
      teamBoard2,
      teamBoard3,
      teamBoard4,
    });
  }, [gaugeBoardTeam3Ref.current, gaugeBoardTeam4Ref.current]);

  return (
    <div className="app-container">
      <main className="main">
        <Row className="w-100">
          <Col lg={2} className="team-gauges">
            <div className="team-gauge">
              <div className="gauge">
                <div
                  className="needle move-1"
                  style={{ transform: `rotate(${calculateDegrees(teams?.[0]?.score ?? 0, topScore)}deg)` }}
                ></div>
                <div
                  className="icon"
                  style={{ backgroundImage: `url(${process.env.REACT_APP_API_UPLOADS_URL}${teams?.[0]?.icon.url})` }}
                ></div>
              </div>
              <div ref={gaugeBoardTeam1Ref}></div>
            </div>
            <div className="team-gauge">
              <div className="gauge">
                <div
                  className="needle move-2"
                  style={{ transform: `rotate(${calculateDegrees(teams?.[1]?.score ?? 0, topScore)}deg)` }}
                ></div>
                <div
                  className="icon"
                  style={{ backgroundImage: `url(${process.env.REACT_APP_API_UPLOADS_URL}${teams?.[1]?.icon.url})` }}
                ></div>
              </div>
              <div ref={gaugeBoardTeam2Ref}></div>
            </div>
            {width <= MAX_WIDTH && (
              <>
                <div className="team-gauge">
                  <div className="gauge">
                    <div
                      className="needle move-3"
                      style={{ transform: `rotate(${calculateDegrees(teams?.[2]?.score ?? 0, topScore)}deg)` }}
                    ></div>
                    <div
                      className="icon"
                      style={{ backgroundImage: `url(${process.env.REACT_APP_API_UPLOADS_URL}${teams?.[2]?.icon.url})` }}
                    ></div>
                  </div>
                  <div ref={gaugeBoardTeam3Ref}></div>
                </div>
                <div className="team-gauge">
                  <div className="gauge">
                    <div
                      className="needle move-4"
                      style={{ transform: `rotate(${calculateDegrees(teams?.[3]?.score ?? 0, topScore)}deg)` }}
                    ></div>
                    <div
                      className="icon"
                      style={{ backgroundImage: `url(${process.env.REACT_APP_API_UPLOADS_URL}${teams?.[3]?.icon.url})` }}
                    ></div>
                  </div>
                  <div ref={gaugeBoardTeam4Ref}></div>
                </div>
              </>
            )}
          </Col>
          <Col lg={8} className="tv-container">
            <div className="w-100 position-relative">
              <div className="tv-screen">
                <div ref={tvScreenDisplayRef} className="tv-screen-display turn-on">
                  <div className="tv-screen-man"></div>
                  <div ref={tvScreenContentRef} className="tv-screen-content">
                    {screen === 'events' && (
                      <>
                        <div className="mb-3">
                          <u className="fs-4">25 Derniers evenements</u>
                        </div>
                        {!events.length && (
                          <div className="mb-2">
                            - 404 Not Found
                          </div>
                        )}
                        {events.map(event => (
                          <div key={event.id} className="mb-2">
                            - {event.team?.name ?? '?'}: {event.score < 0 ? event.score : `+${event.score}`} pour &quot;{event.reason}&quot;
                          </div>
                        ))}
                      </>
                    )}
                    {screen === 'teams' && (
                      <>
                        <div className="mb-3">
                          <u className="fs-4">Les equipes</u>
                        </div>
                        {!teams.length ? (
                          <div className="mb-2">
                            - 404 Not Found
                          </div>
                        ) : (
                          <div className="d-flex align-items-center justify-content-between" style={{ height: '90%' }}>
                            <div className="d-flex flex-column justify-content-around h-100">
                              <div>
                                {`<- ${teams[0].name}: ${teams[0].score}`}
                                <br />
                                {`(${getTeamPosition(teams, teams[0])})`}
                              </div>
                              <div>
                                {`<- ${teams[1].name}: ${teams[1].score}`}
                                <br />
                                {`(${getTeamPosition(teams, teams[1])})`}
                              </div>
                            </div>
                            <div className="d-flex flex-column justify-content-around h-100" style={{ textAlign: 'right' }}>
                              <div>
                                {`${teams[2].name}: ${teams[2].score} ->`}
                                <br />
                                {`(${getTeamPosition(teams, teams[2])})`}
                              </div>
                              <div>
                                {`${teams[3].name}: ${teams[3].score} ->`}
                                <br />
                                {`(${getTeamPosition(teams, teams[3])})`}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="tv-screen-overlay">AV-1</div>
              </div>
              <div className="tv-border"></div>
            </div>
          </Col>
          {width > MAX_WIDTH && (
            <Col lg={2} className="team-gauges">
              <div className="team-gauge">
                <div className="gauge">
                  <div
                    className="needle move-3"
                    style={{ transform: `rotate(${calculateDegrees(teams?.[2]?.score ?? 0, topScore)}deg)` }}
                  ></div>
                  <div
                    className="icon"
                    style={{ backgroundImage: `url(${process.env.REACT_APP_API_UPLOADS_URL}${teams?.[2]?.icon.url})` }}
                  ></div>
                </div>
                <div ref={gaugeBoardTeam3Ref}></div>
              </div>
              <div className="team-gauge">
                <div className="gauge">
                  <div
                    className="needle move-4"
                    style={{ transform: `rotate(${calculateDegrees(teams?.[3]?.score ?? 0, topScore)}deg)` }}
                  ></div>
                  <div
                    className="icon"
                    style={{ backgroundImage: `url(${process.env.REACT_APP_API_UPLOADS_URL}${teams?.[3]?.icon.url})` }}
                  ></div>
                </div>
                <div ref={gaugeBoardTeam4Ref}></div>
              </div>
            </Col>
          )}
        </Row>
      </main>
    </div>
  )
};

export default App;