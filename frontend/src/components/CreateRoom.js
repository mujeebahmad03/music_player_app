import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from "@mui/material";

function CreateRoom({
  update,
  defaultVotesToSkip,
  defaultGuestCanPause,
  roomCode,
  getRoomDetails
}) {
  const defaultVotes = 2;
  const [guestCanPause, setGuestCanPause] = useState(defaultGuestCanPause === 'true');
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (update) {
      setGuestCanPause(defaultGuestCanPause === 'true');
      setVotesToSkip(defaultVotesToSkip);
    }
  }, [update, defaultGuestCanPause, defaultVotesToSkip]);

  const handleVotesChange = useCallback((e) => {
    setVotesToSkip(e.target.value);
  }, []);

  const handleGuestCanPauseChange = useCallback((e) => {
    setGuestCanPause(e.target.value === "true");
  }, []);

  const handleCreateOrUpdateRoom = useCallback((requestMethod) => {
    const requestOptions = {
      method: requestMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      }),
    };
  
    fetch(requestMethod === "POST" ? "/api/create-room" : "/api/update-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json(); 
        } else {
          setErrorMsg(`Error ${requestMethod === "POST" ? "creating" : "updating"} room...`);
          return null; 
        }
      })
      .then((data) => {
        if (data) {
          setTimeout(() => {
            navigate(`/room/${data.code}`); 
          }, 1000);
          setSuccessMsg(requestMethod === "POST" ? "Room created successfully!" : "Room updated successfully!");
          getRoomDetails();
        }
      })
      .catch((error) => setErrorMsg(`Error ${requestMethod === "POST" ? "creating" : "updating"} room...`));
  }, [votesToSkip, guestCanPause, roomCode, getRoomDetails]);
  
  const renderActionButton = () => {
    if (update) {
      return (
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleCreateOrUpdateRoom("PATCH")}
          >
            Update Room
          </Button>
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleCreateOrUpdateRoom("POST")}
            >
              Create A Room
            </Button>
          </Grid>
          <Grid item xs={12} align="center">
            <Button color="secondary" variant="contained" to="/" component={Link}>
              Back
            </Button>
          </Grid>
        </Grid>
      );
    }
  };

  const title = update ? "Update Room" : "Create a Room";

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg !== "" || successMsg !== ""}>
          {successMsg !== "" ? (
            <Alert severity="success" onClose={() => setSuccessMsg("")}>
              {successMsg}
            </Alert>
          ) : (
            <Alert severity="error" onClose={() => setErrorMsg("")}>
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            Guest Control of Playback State
          </FormHelperText>
          <RadioGroup
            row
            value={guestCanPause}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value={true}
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value={false}
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required
            type="number"
            onChange={handleVotesChange}
            value={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            Votes Required To Skip Song
          </FormHelperText>
        </FormControl>
      </Grid>
      {renderActionButton()}
    </Grid>
  );
}

export default CreateRoom;
