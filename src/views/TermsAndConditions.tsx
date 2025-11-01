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

function TermsAndConditions() {
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
    <Box className="App" sx={{ textAlign: "left" }}>
      <CustomAppBar
        authToken={authToken}
        onLogout={handleLogout}
        onPagesClick={handlePagesClick}
        onSettingsClick={handleSettingsClick}
      />
      <Box
        sx={{
          alignItems: "left",
          marginTop: "5%",
          marginLeft: "25%",
          marginRight: "25%",
          marginBottom: "5%",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Regulamin
        </Typography>
        <Typography variant="h5" sx={{ marginTop: "3%" }} paragraph>
          §1. Postanowienia ogólne
        </Typography>
        <Typography paragraph>
          a. Usługi – mają znaczenie nadane w dalszej części Regulaminu.
          <br />
          b. Serwis – serwis internetowy prowadzony przez Usługodawcę pod
          adresem: ...
          <br />
          c. Regulamin – niniejszy regulamin świadczenia usług drogą
          elektroniczną przez Usługodawcę.
          <br />
          d. Użytkownik – osoba fizyczna, posiadająca pełną zdolność do
          czynności prawnych, która dokonała Rejestracji w Serwisie i nabyła
          bilet na wydarzenie.
          <br />
          e. Organizator – osoba fizyczna lub prawna, która zamieszcza w
          Serwisie informacje o organizowanych przez siebie wydarzeniach.
          <br />
          f. Profil – zbiór informacji na temat Organizatora umieszczony w
          Serwisie w postaci podstrony Serwisu posiadającej unikalny adres URL.
          <br />
          g. Rejestracja – proces utworzenia Konta Użytkownika lub Konta
          Organizatora.
          <br />
        </Typography>
        <Typography variant="h5" sx={{ marginTop: "3%" }} paragraph>
          §2. Rodzaje i zakres Usług
        </Typography>
        <Typography paragraph>
          1. Usługodawca świadczy dla Użytkowników między innymi następujące
          Usługi:
        </Typography>
        <Typography sx={{ marginLeft: "3%" }} paragraph>
          a. udostępnia wyszukiwarkę wydarzeń;
          <br />
          b. umożliwia Użytkownikom zakup biletów na wydarzenia;
          <br />
          c. umożliwia Użytkownikom prowadzenie za pośrednictwem aplikacji
          mobilnej dialogu z Organizatorami, którzy udostępnili taką możliwość;
          <br />
          d. umożliwia zamieszczanie informacji o wydarzeniach przez
          Organizatorów.
          <br />
        </Typography>
        <Typography paragraph>
          2. Usługi dla Użytkowników oraz usługi Profilu podstawowego są
          nieodpłatne.
          <br />
        </Typography>
        <Typography variant="h5" sx={{ marginTop: "3%" }} paragraph>
          §3. Warunki świadczenia Usług dla Użytkowników
        </Typography>
        <Typography paragraph>
          1. W celu korzystania z Usług, Użytkownik:
        </Typography>
        <Typography sx={{ marginLeft: "3%" }} paragraph>
          a. musi dokonać Rejestracji,
          <br />
          b. musi posiadać dostęp do sieci Internet,
          <br />
          c. musi posiadać przeglądarkę internetową (jedną z następujących):
          Firefox, Chrome, Safari, IE, Opera, zaktualizowaną do najnowszej
          wersji.
          <br />
        </Typography>
        <Typography paragraph>
          2. Każdy korzystający z Internetu może zapoznawać się z informacjami o
          wydarzeniach i Organizatorach oraz korzystać z wyszukiwarki.
        </Typography>
      </Box>
      <Footer />
    </Box>
  );
}

export default TermsAndConditions;
