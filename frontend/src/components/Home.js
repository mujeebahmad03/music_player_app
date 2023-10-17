import React, { useEffect, useState } from "react";
import {Link, Navigate, Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import JoinRoom from "./JoinRoom";
import CreateRoom from "./CreateRoom";
import Room from "./Room";
import { Button, ButtonGroup, Grid, Typography } from "@mui/material";

function Home() {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    async function fetchRoomCode() {
      try {
        const response = await fetch("/api/user-in-room");
        const data = await response.json();
        setRoomCode(data.code);
      } catch (error) {
        console.error("Error fetching room code:", error);
      }
    }

    fetchRoomCode();
  }, []);

  const renderHomePage = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  };

  const clearRoomCode = () => {
    setRoomCode(null)
  }
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            roomCode ?  (<Navigate to={`/room/${roomCode}`} />) : (renderHomePage())
          }
        />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/room/:roomCode" element={<Room leaveRoom={clearRoomCode}/>} />
      </Routes>
    </Router>
  );
}

export default Home;
