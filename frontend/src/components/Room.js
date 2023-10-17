import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
import CreateRoom from "./CreateRoom";
import MusicPlayer from "./MusicPlayer";

function Room({leaveRoom}) {
  const { roomCode } = useParams();
  const [state, setState] = useState({
    loading: true,
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuth: false,
    song: {},
  });

  const navigate = useNavigate()

  useEffect(() => {
    getRoomDetails();
    const interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval);
  }, []); 


  const getRoomDetails = () => {
    console.log("getRoomDetails called");
    fetch("/api/get-room?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          leaveRoom();
          navigate('/');
        }
        return response.json();
      })
      .then((data) => {
        setState((prevState) => ({
          ...prevState,
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        }));
        console.log(state);
        console.log(data);
        if (data.is_host) {
          authSpotify();
        } else {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
        }
      });
  };

  const authSpotify = () => {
    fetch('/spotify/is-authenticated')
      .then((response) => response.json())
      .then((data) => {
        setState((prevState) => ({
          ...prevState,
          spotifyAuth: data.status,
        }));
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        } else {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
        }
      })
      .catch((error) => {
        console.error(error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      });
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setState((prevState) => ({ ...prevState, song: data, loading:false }));
    });
  };

  const handleLeaveRoom = () => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    };
    fetch('/api/leave-room', requestOptions)
      .then((_response) => {
        leaveRoom();
        navigate('/')
      })
  }

  const handleShowSettings = (value) =>{
    setState((prevState) => ({ ...prevState, showSettings: value }));
  }
  
  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoom
            update={true}
            defaultVotesToSkip={state.votesToSkip}
            defaultGuestCanPause={state.guestCanPause}
            roomCode={roomCode}
            getRoomDetails={getRoomDetails}
            setShowSettings
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }
  if (state.loading) {
    return <div>Loading...</div>;
  } else if (state.showSettings) {
    return renderSettings();
  } else {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <MusicPlayer {...state.song} />
        </Grid>
        {state.isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default Room;