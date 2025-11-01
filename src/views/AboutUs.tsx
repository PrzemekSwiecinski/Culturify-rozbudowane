import React, { useState, useEffect } from "react";
import "../App.css";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CustomAppBar from "../components/CustomAppBar";
import Footer from "../components/Footer";

interface Eventt {
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

function AboutUs() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [cart, setCart] = useState<{ event: Eventt; count: number }[]>([]);

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

  const handleIncrease = (eventId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.event.id_wydarzenia === eventId
          ? { ...item, count: item.count + 1 }
          : item
      )
    );
  };

  const handleDecrease = (eventId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.event.id_wydarzenia === eventId
            ? { ...item, count: Math.max(1, item.count - 1) }
            : item
        )
        .filter((item) => item.count > 0)
    );
  };

  const handleRemove = (eventId: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.event.id_wydarzenia !== eventId)
    );
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setAuthToken(authToken);

    // Pobieranie koszyka z localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Błąd parsowania danych koszyka z localStorage:", error);
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.event.cena * item.count,
    0
  );

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
          O Nas
        </Typography>
        <Typography variant="h6" paragraph sx={{ marginTop: "5%" }}>
          Witaj na stronie Culturify! Jesteśmy platformą wydarzeniową,
          działającą od 2020 roku, która umożliwia organizatorom łatwe i wygodne
          wstawianie wydarzeń, a użytkownikom kupowanie biletów online.
        </Typography>
        <Typography variant="h6" paragraph>
          Naszym celem jest zapewnienie szybkiego dostępu do różnorodnych
          wydarzeń kulturalnych, artystycznych i rozrywkowych. Współpracujemy z
          doświadczonymi organizatorami w różnych dziedzinach, aby zapewnić
          bogatą ofertę wydarzeń.
        </Typography>
        <Typography variant="h6" paragraph>
          Nasza platforma umożliwia łatwe wyszukiwanie wydarzeń, kupowanie
          biletów, a także skuteczną komunikację między organizatorami a
          uczestnikami. Jesteśmy dumni z zespołu świetnych organizatorów, którzy
          są gotowi dostarczyć Ci niezapomnianych wrażeń.
        </Typography>
        <Typography variant="h6" paragraph>
          Dziękujemy, że jesteś z nami i pozwól nam umilić Twoje chwile. Jeśli
          masz pytania lub sugestie, skontaktuj się z nami.
        </Typography>
      </Box>
      <Footer />
    </Box>
  );
}

export default AboutUs;
