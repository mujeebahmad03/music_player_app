import { Card, Grid, IconButton, LinearProgress, Typography } from "@mui/material";
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import React from "react";

const MusicPlayer = (props) => {
  const songProgress = (props?.time / props?.duration) * 100;

  const playOrPause = (action) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(`/spotify/${action}`, requestOptions);
  }
  
  const skipSong = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(`/spotify/skip`, requestOptions);
  }
  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img src={props?.image_url} height="100%" width="100%" alt="Album Cover" />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {props?.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {props?.artist}
          </Typography>
          <div>
            <IconButton onClick={() => props.is_playing ? playOrPause('pause') : playOrPause('play')}>
              {props?.is_playing ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
            </IconButton>
            <IconButton onClick={() => skipSong()}>
              {props.votes} / {props.votes_required}
              <SkipNextRoundedIcon />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
};

export default MusicPlayer;
