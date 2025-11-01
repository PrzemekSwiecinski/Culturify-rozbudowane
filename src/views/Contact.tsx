import React, { useState, useEffect } from "react";
import "../App.css";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CustomAppBar from "../components/CustomAppBar";
import Footer from "../components/Footer";

interface Eventt {
  price: number; // Dodane pole
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

function Contact() {
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

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setAuthToken(authToken);
  });

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
    <Box className="App" sx={{ textAlign: "left" }}>
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
          width: "50%",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Kontakt
        </Typography>
        <Typography variant="h6" paragraph sx={{ marginTop: "5%" }}>
          Culturify Sp. z o.o. <br />
          ul. Wiejska 10
          <br />
          15-308 Białystok
          <br />
          Polska
          <br />
          NIP: 0000000000
          <br />
          KRS: 0000000000
          <br />
          REGON: 000000
          <br />
        </Typography>
        <Typography
          variant="h6"
          sx={{ marginTop: "6%" }}
          fontWeight="bold"
          gutterBottom
          paragraph
        >
          Kontakt do supportu: <b />
          <br />
        </Typography>
        <Typography variant="h6" paragraph>
          Email: support.culturify@gmail.pl <br />
          Infolinia: 678123610
        </Typography>
      </Box>
      <Footer />
    </Box>
  );
}

export default Contact;
