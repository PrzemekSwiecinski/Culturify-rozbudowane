import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

interface Props {
  authToken: string | null;
  onLogout: () => void;
  onPagesClick: (page: string) => void;
  onSettingsClick: (setting: string) => void;
}

const pages = ["Galeria"];
const settings = ["Wyloguj"];

const ModAppBar: React.FC<Props> = ({
  authToken,
  onLogout,
  onPagesClick,
  onSettingsClick,
}) => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

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
      sx={{ marginBottom: "5%", backgroundColor: "var(--primary-color)" }}
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
                  color: "white",
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

export default ModAppBar;
