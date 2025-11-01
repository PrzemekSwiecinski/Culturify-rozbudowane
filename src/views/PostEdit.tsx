import React, { useState, useEffect } from "react";
import "../App.css";
import {
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
} from "@mui/material";
import axios from "axios";
import Footer from "../components/Footer";
import ModAppBar from "../components/ModAppBar";

interface Organizer {
  id_organizatora: number;
  nazwa: string;
  telefon: string;
}

interface Order {
  id_zamowienia: number;
  id_uzytkownika: number;
  cena: number;
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
}

interface Moderator {
  id_moderatora: number;
  imie: string;
  nazwisko: string;
  kategoria: string;
}

interface Post {
  id_postu: number;
  id_moderatora: number;
  id_uzytkownika: number | null;
  kategoria: string;
  tresc: string;
  czy_dodany: number;
}

function PostEdit() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

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
        setIsLoggedOut(true);
      } else {
        console.error("Błąd wylogowania");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas wylogowywania:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost/api/pobierz_posty.php"
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania postów:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token ? token : null); // zabezpieczenie

    fetchModerators();
    fetchOrders();
    fetchOrganizers();
    fetchPosts();
  }, []);

  const fetchModerators = () => {
    axios
      .get("http://localhost/api/pobierz_moderatorow.php")
      .then((response) => {
        setModerators(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych moderatorów:", error);
      });
  };
  const fetchOrders = () => {
    axios
      .get("http://localhost/api/pobierz_zamowienia_uzytkownikow.php")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych zamówień:", error);
      });
  };
  const fetchOrganizers = () => {
    let url = "http://localhost/api/pobierz_organizatorow.php";
    axios
      .get(url)
      .then((response) => {
        setOrganizers(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych organizatorów:", error);
      });
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseDialog = () => {
    setSelectedPost(null);
  };

  const handleSavePost = async (id_postu: number, tresc: string) => {
    try {
      const response = await axios.post(
        "http://localhost/api/edytuj_post.php",
        {
          id_postu: id_postu,
          tresc: tresc,
        }
      );

      if (response.data.message) {
        fetchPosts();
        setSelectedPost(null);
      } else {
        console.error("Błąd edycji:", response.data.error);
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas edycji:", error);
    }
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
        <Typography variant="h4" gutterBottom>
          Panel Administratora - Edycja Postów
        </Typography>
        <Grid
          sx={{
            flexDirection: "column",
            alignContent: "center",
            marginTop: "1%",
            marginBottom: "5%",
          }}
          container
          spacing={2}
          justifyContent="center"
        >
          {posts.map((post) => (
            <Grid
              sx={{ width: "100%" }}
              item
              key={post.id_postu}
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              <Card
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  cursor: "pointer",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="subtitle1">
                      Id posta: {post.id_postu}
                    </Typography>
                    <Typography variant="body1">
                      Kategoria: {post.kategoria}
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: "10px" }}>
                      Treść: {post.tresc}
                    </Typography>
                  </Box>
                  <Button
                    sx={{
                      backgroundColor: "var(--primary-color)",
                      "&:hover": {
                        backgroundColor: "red",
                      },
                    }}
                    variant="contained"
                    onClick={() => handleEditPost(post)}
                  >
                    Edytuj
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Modal
          key={selectedPost?.id_postu} // Dodanie unikalnego key
          open={Boolean(selectedPost)}
          onClose={handleCloseDialog}
          aria-labelledby="post-modal"
          aria-describedby="post-modal-description"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "1rem",
              maxWidth: "500px",
              margin: "auto",
              backgroundColor: "white",
              borderRadius: "10px",
              marginTop: "10%",
            }}
          >
            {selectedPost && (
              <>
                <Typography variant="h6" sx={{ marginTop: "10px" }}>
                  Edytuj Post: {selectedPost.id_postu}
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                  value={selectedPost.tresc}
                  onChange={(e) =>
                    setSelectedPost({ ...selectedPost, tresc: e.target.value })
                  }
                />
                <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleSavePost(selectedPost.id_postu, selectedPost.tresc)
                    }
                    sx={{
                      backgroundColor: "var(--primary-color)",
                      "&:hover": {
                        backgroundColor: "red",
                      },
                    }}
                  >
                    Zapisz
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: "#808080",
                      "&:hover": {
                        backgroundColor: "#808080",
                      },
                    }}
                    variant="contained"
                    onClick={handleCloseDialog}
                  >
                    Zamknij
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </Box>
      <Footer />
    </Box>
  );
}

export default PostEdit;
