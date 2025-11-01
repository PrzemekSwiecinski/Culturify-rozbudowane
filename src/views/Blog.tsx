import React, { useState, useEffect, useCallback } from "react";
import "../App.css";
import {
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CustomAppBar from "../components/CustomAppBar";
import { useNavigate } from "react-router-dom";
import { SelectChangeEvent } from "@mui/material/Select";
import Footer from "../components/Footer";

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
}

interface Comment {
  id_komentarza: number;
  id_użytkownika: number | null;
  tresc: string;
}

function Blog() {
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [newPostCategory, setNewPostCategory] = useState<string>("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [cart, setCart] = useState<{ event: Eventt; count: number }[]>([]);

  const postCategories = [
    "Pomoc techniczna",
    "Informacje o wydarzeniach",
    "Informacje o biletach",
  ];

  const handleLogout = () => {
    setIsLoggedOut(true);
  };

  const handleSettingsClick = (setting: string) => {
    if (setting === "Profil") {
      window.location.href = "/profil_uzytkownika";
    } else if (setting === "Moje bilety") {
      window.location.href = "/bilety_uzytkownika";
    } else if (setting === "Ryneczek Culturify") {
      window.location.href = "/rynek_biletow";
    } else if (setting === "Wyloguj") {
      handleLogoutConfirm();
    } else {
      handleCloseUserMenu();
    }
  };

  const handlePagesClick = (page: string) => {
    if (page === "O Nas") {
      window.location.href = "/onas";
    } else if (page === "Regulamin") {
      window.location.href = "/regulamin";
    } else if (page === "Kontakt") {
      window.location.href = "/kontakt";
    } else if (page === "Galeria") {
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
        const response = await fetch("http://localhost/api/pobierz_posty.php");
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
  }, []);

  const fetchComments = useCallback(async () => {
    if (selectedPostId !== null) {
      try {
        const response = await fetch(
          `http://localhost/api/pobierz_komentarze.php?id_postu=${selectedPostId}`
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
    }
  }, [selectedPostId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleNewCommentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewComment(event.target.value);
  };

  const handleNewPostCategoryChange = (event: SelectChangeEvent<string>) => {
    setNewPostCategory(event.target.value);
  };

  const handleNewPostContentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPostContent(event.target.value);
  };

  const handleSubmitComment = async () => {
    if (newComment.trim() === "") return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("Brak tokenu sesji.");
      return;
    }
    try {
      const response = await fetch("http://localhost/api/dodaj_komentarz.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_postu: selectedPostId,
          authToken: authToken,
          tresc: newComment,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message);
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Błąd podczas dodawania komentarza:", error);
    }
  };

  const handleSubmitPost = async () => {
    if (newPostCategory.trim() === "" || newPostContent.trim() === "") return;
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      console.error("Brak tokenu sesji.");
      return;
    }
    try {
      const response = await fetch("http://localhost/api/dodaj_post.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_moderatora: 1, //tymczasowe id, trzeba pobierać
          kategoria: newPostCategory,
          tresc: newPostContent,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message);
      setNewPostCategory("");
      setNewPostContent("");
      const fetchPosts = async () => {
        try {
          const response = await fetch(
            "http://localhost/api/pobierz_posty.php"
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
      console.error("Błąd podczas dodawania postu:", error);
    }
  };

  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId);
  };

  const handleBackToPosts = () => {
    setSelectedPostId(null);
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

  if (selectedPostId === null) {
    return (
      <Box className="App">
        <CustomAppBar
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
            Blog
          </Typography>

          <Box
            sx={{
              marginBottom: "2rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Dodaj post
            </Typography>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{ marginBottom: "1rem" }}
            >
              <InputLabel id="post-category-label">Kategoria posta</InputLabel>
              <Select
                labelId="post-category-label"
                id="post-category"
                value={newPostCategory}
                onChange={handleNewPostCategoryChange}
                label="Kategoria posta"
              >
                {postCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Treść posta"
              multiline
              rows={4}
              value={newPostContent}
              onChange={handleNewPostContentChange}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: "1rem" }}
            />
            <Button
              sx={{
                backgroundColor: "#800000",
                "&:hover": {
                  backgroundColor: "red",
                },
              }}
              variant="contained"
              onClick={handleSubmitPost}
            >
              Dodaj post
            </Button>
          </Box>

          {/* Wyświetlanie listy postów */}
          {posts.length === 0 ? (
            <Typography>Brak postów.</Typography>
          ) : (
            posts.map((post) => (
              <Box
                key={post.id_postu}
                sx={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant="h6"
                  onClick={() => handlePostClick(post.id_postu)}
                  sx={{ cursor: "pointer", color: "#800000" }}
                >
                  {post.kategoria}
                </Typography>
                <Typography variant="body2">{post.tresc}</Typography>
              </Box>
            ))
          )}
        </Box>

        <Box
          component="footer"
          sx={{
            backgroundColor: "#800000",
            color: "white",
            textAlign: "center",
            padding: "1.5rem 0",
            bottom: 0,
            width: "100%",
          }}
        >
          <Typography variant="h6">
            Culturify © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="App">
      <CustomAppBar
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
        {/* Wyświetlanie szczegółów postu */}
        <Typography variant="h4" gutterBottom>
          {posts.find((post) => post.id_postu === selectedPostId)?.kategoria}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {posts.find((post) => post.id_postu === selectedPostId)?.tresc}
        </Typography>
        <Button
          variant="contained"
          onClick={handleBackToPosts}
          sx={{
            backgroundColor: "#800000",
            "&:hover": {
              backgroundColor: "red",
            },
            marginTop: "2rem",
            marginBottom: "2rem",
          }}
        >
          Wróć do listy postów
        </Button>

        {/* Sekcja komentarzy */}
        <Box sx={{ marginTop: "2rem" }}>
          <Typography variant="h5" gutterBottom>
            Dodaj komentarz
          </Typography>
          <TextField
            label="Twój komentarz"
            multiline
            rows={4}
            value={newComment}
            onChange={handleNewCommentChange}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
          />
          <Button
            sx={{
              backgroundColor: "#800000",
              "&:hover": {
                backgroundColor: "red",
              },
            }}
            variant="contained"
            onClick={handleSubmitComment}
          >
            Dodaj komentarz
          </Button>
        </Box>

        <Box sx={{ marginTop: "3rem" }}>
          <Typography variant="h5" gutterBottom>
            Komentarze użytkowników
          </Typography>

          {/* Wyświetlanie komentarzy */}
          {comments.length === 0 ? (
            <Typography>Brak komentarzy.</Typography>
          ) : (
            comments.map((comment, index) => (
              <Box
                key={index}
                sx={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="body1">
                  <strong>Użytkownik: {comment.id_użytkownika}</strong>
                </Typography>
                <Typography variant="body2">{comment.tresc}</Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default Blog;
