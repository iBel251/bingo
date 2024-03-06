import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Box,
  Button,
} from "@mui/material";
import background from "../assets/roller.webp";
import kishkish from "../assets/kishkish.webp";
import { useNavigate } from "react-router-dom";
import useMainStore from "../store/mainStore";

// Define styles
const styles = {
  container: {
    paddingTop: "100px",
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)),url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "15px",
    padding: {
      sm: "5px",
      md: "20px",
    },
    marginTop: "0px",
    maxWidth: "95%",
    margin: "auto",
  },
  card: {
    height: "100%",
    width: {
      md: "300px",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "black",
  },
  cardContent: {
    background: "rgb(0,0,0,0.8)",
    width: "100%",
    color: "white",
    textAlign: "center",
  },
  media: {
    height: "150px", // Specify the height of the media area
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  startBtn: {
    color: "black",
    background: "goldenrod",
    marginTop: "10px",
    border: "1px solid black",
    "&:hover": {
      background: "black",
      color: "goldenrod",
      border: "1px solid goldenrod",
    },
  },
};
const gamesData = [
  {
    id: 1,
    title: "ኪሽ ኪሽ",
    description:
      "ከ50 እስከ 200 ሰው እጣ ቁጥር በመምረጥ የሚሳተፉበት። አሸናፊ ቁጥሮች እስከ 5000 ብር ያገኛሉ።",
    pic: kishkish,
  },
  {
    id: 2,
    title: "ኬኖ",
    description:
      "Description of Game 2xgfgfdg dfgdfgdf dfg dffgfdgdfgdfgfd fgf.",
    pic: "https://placehold.co/600x400",
  },
  {
    id: 3,
    title: "Game 3",
    description: "Description of Game 3.",
    pic: "https://placehold.co/600x200",
  },
  {
    id: 4,
    title: "Game 4",
    description: "Description of Game 4.",
    pic: "https://placehold.co/600x200",
  },
  {
    id: 5,
    title: "Game 5",
    description: "Description of Game 5.",
    pic: "https://placehold.co/600x200",
  },
  // Add more games...
];
const Games = () => {
  const navigate = useNavigate();
  const { setHeadTo } = useMainStore();
  const handlePlay = (id) => {
    if (id === 1) {
      setHeadTo("/games/bingo");
      navigate("bingo");
    }
  };
  return (
    <Box sx={styles.container}>
      <Typography
        variant="h3"
        sx={{
          color: "goldenrod",
          textAlign: "center",
          textDecoration: "underline",
          textUnderlineOffset: "5px",
        }}
      >
        ጨዋታዎች
      </Typography>
      <Box spacing={2} sx={styles.cardContainer}>
        {gamesData.map((game) => (
          <Box key={game.id}>
            <Card
              sx={{
                ...styles.card,
                backgroundImage: `url(${game.pic})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <CardMedia width="140px" sx={styles.media} title={game.title} />
              <CardContent sx={styles.cardContent}>
                <Typography
                  sx={styles.title}
                  color="goldenrod"
                  variant="h2"
                  gutterBottom
                >
                  {game.title}
                </Typography>
                <Typography variant="body2" component="p" maxWidth={"400px"}>
                  {game.description}
                </Typography>
                <Button
                  sx={styles.startBtn}
                  onClick={() => handlePlay(game.id)}
                >
                  Play
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Games;
