import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Tooltip,
  Menu,
} from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartProvider";
import Cart from "./Cart";

interface Props {
  authToken: string | null;
  onLogout: () => void;
  onPagesClick: (page: string) => void;
  onSettingsClick: (setting: string) => void;
}

const pages = ["O Nas", "Regulamin", "Kontakt", "Galeria", "Blog"];
const settings = ["Profil", "Moje bilety", "Ryneczek Culturify", "Wyloguj"];

const CustomAppBar: React.FC<Props> = ({
  authToken,
  onLogout,
  onPagesClick,
  onSettingsClick,
}) => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const [primaryColor, setPrimaryColor] = useState("");
  const [primaryColorLight, setPrimaryColorLight] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [textColor, setTextColor] = useState("");

  useEffect(() => {
    fetchThemeColors();
  }, []);

  const fetchThemeColors = () => {
    const storedPrimaryColor = localStorage.getItem("primaryColor");
    const storedSecondaryColor = localStorage.getItem("secondaryColor");
    const storedTextColor = localStorage.getItem("textColor");

    if (storedPrimaryColor && storedSecondaryColor && storedTextColor) {
      setPrimaryColor(storedPrimaryColor);
      setSecondaryColor(storedSecondaryColor);
      setTextColor(storedTextColor);
      setThemeOnRoot(storedPrimaryColor, storedSecondaryColor, storedTextColor);
    } else {
      const rootStyles = getComputedStyle(document.documentElement);
      const primaryColor = rootStyles
        .getPropertyValue("--primary-color")
        .trim();
      const secondaryColor = rootStyles
        .getPropertyValue("--secondary-color")
        .trim();
      const textColor = rootStyles.getPropertyValue("--text-color").trim();

      setPrimaryColor(primaryColor);
      setSecondaryColor(secondaryColor);
      setTextColor(textColor);
      setThemeOnRoot(primaryColor, secondaryColor, textColor);
      localStorage.setItem("primaryColor", primaryColor);
      localStorage.setItem("secondaryColor", secondaryColor);
      localStorage.setItem("textColor", textColor);
    }
  };

  const setThemeOnRoot = (
    primaryColor: string,
    secondaryColor: string,
    textColor: string
  ) => {
    const primaryColorLight = lightenColor(primaryColor, 40);
    const secondaryColorDark = darkenColor(secondaryColor, 40);
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty(
      "--secondary-color",
      secondaryColor
    );
    document.documentElement.style.setProperty("--text-color", textColor);
    document.documentElement.style.setProperty(
      "--primary-color-light",
      primaryColorLight
    );
    document.documentElement.style.setProperty(
      "--secondary-color-dark",
      secondaryColorDark
    );
  };

  function lightenColor(hex: string, percent: number): string {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r = Math.min(255, Math.max(0, Math.round(r + (255 - r) * (percent / 100))));
    g = Math.min(255, Math.max(0, Math.round(g + (255 - g) * (percent / 100))));
    b = Math.min(255, Math.max(0, Math.round(b + (255 - b) * (percent / 100))));

    return (
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0")
    );
  }

  function darkenColor(hex: string, percent: number): string {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r = Math.max(0, Math.min(255, Math.round(r - r * (percent / 100))));
    g = Math.max(0, Math.min(255, Math.round(g - g * (percent / 100))));
    b = Math.max(0, Math.min(255, Math.round(b - b * (percent / 100))));
    return (
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0")
    );
  }

  const handleCartOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        marginBottom: "5%",
        backgroundColor: "var(--primary-color)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Avatar
            sx={{ marginLeft: "8%", marginRight: "2%", cursor: "pointer" }}
            alt="logo"
            src="/assets/logo.png"
            onClick={() => navigate("/")}
          />

          {/* Title */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              fontSize: "1.4rem",
            }}
          >
            Culturify
          </Typography>

          {/* Mobile Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", lg: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              ☰
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
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => onPagesClick(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Navigation */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", lg: "flex" },
              marginLeft: "2rem",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => onPagesClick(page)}
                sx={{
                  my: 2,
                  color: "var(--text-color)",
                  display: "block",
                  marginLeft: "1%",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Authenticated User Options */}
          {authToken ? (
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Cart */}
              <IconButton
                component="button"
                onClick={handleCartOpen}
                sx={{ color: "white", fontSize: "1.8rem" }}
              >
                <ShoppingBasketIcon fontSize="large" />
              </IconButton>
              <Cart anchorEl={cartAnchorEl} onClose={handleCartClose} />

              {/* User Menu */}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="profile_pic" src="/assets/profile.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => onSettingsClick(setting)}
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
  );
};

export default CustomAppBar;
