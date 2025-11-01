import React, { useState, useEffect } from "react";
import "../App.css";
import {
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import ModAppBar from "../components/ModAppBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

interface Eventt {
  id: number;
  name: string;
  price: number;
  id_wydarzenia: number;
  id_organizatora: string;
  typ: string;
  nazwa: string;
  data: string;
  godzina: string;
  miasto: string;
  adres: string;
  opis: string;
  zdjecie: string;
  cena: number;
}

interface Post {
  id_postu: number;
  id_moderatora: number;
  id_uzytkownika: number | null;
  kategoria: string;
  tresc: string;
  czy_dodany: number;
}

interface Comment {
  id_komentarza: number;
  id_użytkownika: number | null;
  tresc: string;
  id_postu: number;
  czy_dodany: number;
}

function ModMainPage() {
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [cart, setCart] = useState<{ event: Eventt; count: number }[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleLogout = () => {
    setIsLoggedOut(true);
  };

  const handleSettingsClick = (setting: string) => {
    if (setting === "Wyloguj") {
      handleLogoutConfirm();
    } else {
      handleCloseUserMenu();
    }
  };

  const handlePagesClick = (page: string) => {
    if (page === "Galeria") {
      window.location.href = "/galeria";
    } else if (page === "Blog") {
      window.location.href = "/blog";
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      const response = await fetch("http://localhost/api/wyloguj.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        setAuthToken(null);
      } else {
        console.error("Błąd wylogowania");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas wylogowywania:", error);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setAuthToken(authToken);

    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost/api/pobierz_oczekujace_posty.php"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Błąd podczas pobierania postów:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost/api/pobierz_oczekujace_komentarze.php`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Błąd podczas pobierania komentarzy:", error);
        setComments([]);
      }
    };
    fetchPosts();
    fetchComments();

    setOpenSnackbar(true); // Setujemy pokazanie powiadomienia przy każdym wejściu na stronę
  }, []);

  const handleAcceptPost = async (postId: number) => {
    try {
      const response = await fetch("http://localhost/api/akceptuj_post.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_postu: postId,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message);
      const fetchPosts = async () => {
        try {
          const response = await fetch(
            "http://localhost/api/pobierz_oczekujace_posty.php"
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error("Błąd podczas pobierania postów:", error);
        }
      };
      fetchPosts();
    } catch (error) {
      console.error("Błąd podczas akceptacji posta:", error);
    }
  };

  const handleAcceptComment = async (commentId: number) => {
    try {
      const response = await fetch(
        "http://localhost/api/akceptuj_komentarz.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_komentarza: commentId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message);
      const fetchComments = async () => {
        try {
          const response = await fetch(
            `http://localhost/api/pobierz_oczekujace_komentarze.php`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setComments(data);
        } catch (error) {
          console.error("Błąd podczas pobierania komentarzy:", error);
          setComments([]);
        }
      };
      fetchComments();
    } catch (error) {
      console.error("Błąd podczas akceptacji komentarza:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.event.cena * item.count,
    0
  );

  return (
    <Box className="App">
      <ModAppBar
        authToken={authToken}
        onLogout={handleLogout}
        onPagesClick={handlePagesClick}
        onSettingsClick={handleSettingsClick}
      />
      <Box
        sx={{
          marginTop: "5%",
          marginLeft: "25%",
          marginRight: "25%",
          marginBottom: "7%",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Panel Moderatora
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Oczekujące posty
            </Typography>
            {posts.length === 0 ? (
              <Typography>Brak postów do akceptacji.</Typography>
            ) : (
              <List>
                {posts.map((post) => (
                  <ListItem
                    key={post.id_postu}
                    sx={{
                      marginBottom: "1.5rem",
                      padding: "1rem",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  >
                    <ListItemText
                      primary={post.kategoria}
                      secondary={post.tresc}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleAcceptPost(post.id_postu)}
                      sx={{
                        backgroundColor: "var(--primary-color)",
                        "&:hover": {
                          backgroundColor: "var(--primary-color-light)",
                        },
                      }}
                    >
                      Akceptuj
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Oczekujące komentarze
            </Typography>
            {comments.length === 0 ? (
              <Typography>Brak komentarzy do akceptacji.</Typography>
            ) : (
              <List>
                {comments.map((comment) => (
                  <ListItem
                    key={comment.id_komentarza}
                    sx={{
                      marginBottom: "1.5rem",
                      padding: "1rem",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  >
                    <ListItemText
                      primary={`Komentarz`}
                      secondary={comment.tresc}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleAcceptComment(comment.id_komentarza)}
                      sx={{
                        backgroundColor: "var(--primary-color)",
                        "&:hover": {
                          backgroundColor: "red",
                        },
                      }}
                    >
                      Akceptuj
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          sx={{ width: "100%" }}
        >
          Pojawił się nowy komentarz!
        </Alert>
      </Snackbar>
      <Footer />
    </Box>
  );
}

export default ModMainPage;
