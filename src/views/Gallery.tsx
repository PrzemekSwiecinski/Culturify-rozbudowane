import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import {
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import CustomAppBar from "../components/CustomAppBar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
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

interface ImageData {
  src: string;
  text: string;
  name: string;
}

function Gallery() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [cart, setCart] = useState<{ event: Eventt; count: number }[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [maxTextHeight, setMaxTextHeight] = useState(0);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const fixedImageHeight = 250;
  const [selectedImagesSrcs, setSelectedImagesSrcs] = useState<string[]>([]);
  const [orderedImages, setOrderedImages] = useState<ImageData[]>([]);
  const [savedConfigs, setSavedConfigs] = useState<string[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>("");

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

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 600 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    const saved = localStorage.getItem("savedConfigs");
    if (saved) {
      setSavedConfigs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "http://localhost/api/pobierz_zdjecia.php"
        );
        if (response.ok) {
          const data: ImageData[] = await response.json();
          setImages(data);
          setSelectedImagesSrcs(data.map((image) => image.src));
        } else {
          console.error("Błąd podczas pobierania zdjęć.");
        }
      } catch (error) {
        console.error("Wystąpił błąd podczas pobierania zdjęć:", error);
      }
    };
    fetchImages();
  }, []);

  const calculateMaxTextHeight = () => {
    if (carouselWrapperRef.current) {
      let max = 0;
      const carouselItems =
        carouselWrapperRef.current.querySelectorAll(".carousel-item");
      carouselItems.forEach((item: any) => {
        const textElement = item.querySelector(".text-container");
        if (textElement) {
          max = Math.max(max, textElement.offsetHeight);
        }
      });
      setMaxTextHeight(max);
    }
  };
  useEffect(() => {
    calculateMaxTextHeight();
  }, [orderedImages]);
  useEffect(() => {
    const handleImageLoad = () => {
      calculateMaxTextHeight();
    };
    const images = carouselWrapperRef.current?.querySelectorAll("img");
    if (images) {
      images.forEach((img) => {
        if (img.complete) {
          handleImageLoad();
        } else {
          img.onload = handleImageLoad;
        }
      });
    }
  }, [orderedImages, images]);

  useEffect(() => {
    const newOrderedImages: ImageData[] = selectedImagesSrcs
      .map((src) => {
        const foundImage = images.find((image) => image.src === src);
        return foundImage ? { ...foundImage } : { src: "", text: "", name: "" };
      })
      .filter((image) => image.src !== "");
    setOrderedImages(newOrderedImages);
  }, [selectedImagesSrcs, images]);

  const handleOrderChange = (
    index: number,
    event: SelectChangeEvent<string>
  ) => {
    const newSelectedImages = [...selectedImagesSrcs];
    newSelectedImages[index] = event.target.value;
    setSelectedImagesSrcs(newSelectedImages);
  };

  const handleSaveConfig = () => {
    const configName = `Zapis ${savedConfigs.length + 1}`;
    const updatedConfigs = [...savedConfigs, configName];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("savedConfigs", JSON.stringify(updatedConfigs));
    localStorage.setItem(configName, JSON.stringify(selectedImagesSrcs));
    setSelectedConfig(configName);
  };

  const handleLoadConfig = (event: SelectChangeEvent<string>) => {
    const configName = event.target.value;
    setSelectedConfig(configName);
    const config = localStorage.getItem(configName);
    if (config) {
      setSelectedImagesSrcs(JSON.parse(config));
    }
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
          marginLeft: "10%",
          marginRight: "10%",
          marginBottom: "7%",
        }}
      >
        <Typography sx={{ marginBottom: "4%" }} variant="h3" gutterBottom>
          Galeria naszych wydarzeń
        </Typography>

        <div ref={carouselWrapperRef}>
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            itemClass="carousel-item-padding-40-px"
          >
            {orderedImages.map((image, index) => (
              <Box
                key={index}
                className="carousel-item"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  overflow: "hidden",
                  borderRadius: "10px",
                  backgroundColor: "#f0f0f0",
                  padding: "2px",
                  height: "auto",
                }}
              >
                <Box
                  sx={{
                    height: `${fixedImageHeight}px`,
                    width: "100%",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={image.src}
                    alt={`Slide ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>

                <Paper
                  elevation={2}
                  className="text-container"
                  sx={{
                    width: "100%",
                    padding: "5px",
                    textAlign: "center",
                    marginTop: "10px",
                    borderRadius: "5px",
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                    minHeight: `${maxTextHeight}px`, // Ustawienie minimalnej wysokości
                    boxSizing: "border-box",
                    maxHeight: "fit-content", // Dodano max-height
                  }}
                >
                  {image.text && (
                    <Typography
                      variant="body1"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {image.text}
                    </Typography>
                  )}
                </Paper>
              </Box>
            ))}
          </Carousel>
        </div>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px", mt: 2 }}>
          {images.map((image, index) => (
            <Select
              key={index}
              value={selectedImagesSrcs[index] || ""}
              onChange={(event) => handleOrderChange(index, event)}
              sx={{ minWidth: "150px" }}
            >
              {images.map((img, i) => (
                <MenuItem key={i} value={img.src}>
                  {img.name}
                </MenuItem>
              ))}
            </Select>
          ))}
        </Box>
        <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            sx={{
              backgroundColor: "#800000",
              "&:hover": {
                backgroundColor: "red",
              },
            }}
            variant="contained"
            onClick={handleSaveConfig}
          >
            Zapisz Ustawienia
          </Button>
          <Select value={selectedConfig} onChange={handleLoadConfig}>
            <MenuItem value="" disabled>
              Wczytaj ustawienia
            </MenuItem>
            {savedConfigs.map((config, index) => (
              <MenuItem key={index} value={config}>
                {config}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default Gallery;
