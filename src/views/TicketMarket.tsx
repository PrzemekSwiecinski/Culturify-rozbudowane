import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Footer from "../components/Footer";

interface Ticket {
  id_biletu: string;
  id_wydarzenia: string; // Upewnij się, że to pole odpowiada id_wydarzenia z bazy danych
  id_uzytkownika: string;
  nazwa: string; // Zaktualizuj odpowiednio nazwę
  data: string;
  godzina: string;
  cena: number;
}

const pages = ["O Nas", "Regulamin", "Kontakt"];
const settings = ["Profil", "Moje bilety", "Ryneczek Culturify", "Wyloguj"];

function TicketMarket() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
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
    const fetchMarketTickets = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await fetch("http://localhost/api/rynek.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ authToken }),
        });

        if (response.ok) {
          const ticketsData = await response.json();
          setTickets(ticketsData);
        } else {
          console.error("Błąd pobierania biletów z rynku");
        }
      } catch (error) {
        console.error(
          "Wystąpił błąd podczas pobierania biletów z rynku:",
          error
        );
      }
    };

    if (authToken) {
      fetchMarketTickets();
    }
  }, [authToken]);

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

  const handleVisitClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleBuyTicket = async () => {
    if (!selectedTicket) {
      console.error("Nie wybrano biletu do kupienia");
      return;
    }

    try {
      const response = await fetch("http://localhost/api/kup_z_ryneczku.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_biletu: selectedTicket.id_biletu,
          authToken: authToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setTickets((prevTickets) =>
          prevTickets.filter(
            (ticket) => ticket.id_biletu !== selectedTicket.id_biletu
          )
        );

        handleModalOpen(); // Otwieramy okno modalne po zakupie biletu
      } else {
        console.error("Nie udało się kupić biletu:", response.statusText);
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas kupowania biletu:", error);
    }
  };

  const renderTickets = () => {
    return tickets.map((ticket, index) => (
      <Card
        key={index}
        sx={{ marginBottom: 3 }}
        onClick={() => handleVisitClick(ticket)}
      >
        <CardContent>
          <Typography variant="h6">
            {ticket.nazwa}, Data: {ticket.data}, Godzina: {ticket.godzina}
          </Typography>
          <Typography variant="body1">Cena: {ticket.cena}zł</Typography>
          <Button
            sx={{
              backgroundColor: "#800000",
              "&:hover": {
                backgroundColor: "red",
              },
              mt: 1,
              width: "30%",
            }}
            type="submit"
            fullWidth
            variant="contained"
            onClick={selectedTicket ? handleBuyTicket : undefined}
          >
            Kup bilet
          </Button>
        </CardContent>
      </Card>
    ));
  };

  return (
    <Box className="App">
      <AppBar
        position="static"
        sx={{
          marginBottom: "5%",
          backgroundColor: "#800000",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Avatar
              sx={{
                marginLeft: "8%",
                marginRight: "2%",
                width: { xs: 30, sm: 40, md: 50 }, // Zmieniamy rozmiar logo na podstawie szerokości ekranu
                height: { xs: 30, sm: 40, md: 50 }, // Zmieniamy rozmiar logo na podstawie szerokości ekranu
              }}
              alt="logo"
              src="/assets/logo.png"
            />
            <Typography
              variant="h6"
              noWrap
              href="/"
              component="a"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "flex" }, // Ustawiamy display: "flex" na urządzeniach mobilnych
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
              }}
            >
              Culturify
            </Typography>

            {/* Menu mobilne */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <span>☰</span> {/* Ikona menu */}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handlePagesClick(page)}>
                    <Typography sx={{}} textAlign="center">
                      {page}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Menu desktopowe */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                marginLeft: "2rem",
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePagesClick(page)}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    marginLeft: "1%",
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            {authToken ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="profile_pic" src="/assets/profile.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleSettingsClick(setting)}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 0 }}>
                <Button
                  component="a"
                  href="/login"
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  Zaloguj
                </Button>
                <Button component="a" href="/rejestracja" color="inherit">
                  Zarejestruj
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="md" sx={{ marginTop: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: "5%" }}>
          Ryneczek Culturify
        </Typography>
        {tickets.length > 0 ? (
          renderTickets()
        ) : (
          <Typography variant="body1">Brak biletów</Typography>
        )}
      </Container>
      <Footer />
    </Box>
  );
}

export default TicketMarket;
