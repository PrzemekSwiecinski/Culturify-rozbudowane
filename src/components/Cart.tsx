import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Menu,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "./CartProvider";
import { useState } from "react";

interface Props {
  anchorEl: null | HTMLElement;
  onClose: () => void;
}

const getUserId = (): string | null => {
  return localStorage.getItem("authToken");
};

const Cart: React.FC<Props> = ({ anchorEl, onClose }) => {
  const {
    cart,
    increaseItem,
    decreaseItem,
    removeItem,
    totalPrice,
    clearCart,
  } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOrder = async () => {
    const authToken = getUserId();

    if (!authToken) {
      setSnackbarMessage("Nie można pobrać tokena.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (cart.length === 0) {
      setSnackbarMessage("Koszyk jest pusty, nie można złożyć zamówienia");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const orderData = {
        authToken: authToken,
        cena: totalPrice,
      };

      const response = await fetch(
        "http://localhost/api/dodaj_zamowienie.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Błąd podczas składania zamówienia:", errorData);
        setSnackbarMessage(
          `Błąd podczas składania zamówienia: ${
            errorData.message || "Nieznany błąd"
          }`
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      setSnackbarMessage("Zamówienie zostało złożone pomyślnie!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      clearCart();
      onClose();
    } catch (error) {
      console.error("Błąd podczas wysyłania zamówienia:", error);
      setSnackbarMessage(
        `Wystąpił błąd podczas składania zamówienia: ${error}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Box sx={{ padding: 2, minWidth: 300 }}>
        <Typography variant="h6">Twój Koszyk</Typography>
        {cart.length > 0 ? (
          <>
            {cart.map(({ event, count }) => (
              <Box
                key={event.id_wydarzenia}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 1,
                }}
              >
                <Typography variant="body2">{event.nazwa}</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    onClick={() => decreaseItem(event.id_wydarzenia)}
                    size="small"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ marginX: 1 }}>{count}</Typography>
                  <IconButton
                    onClick={() => increaseItem(event.id_wydarzenia)}
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                  <Button
                    onClick={() => removeItem(event.id_wydarzenia)}
                    size="small"
                    color="error"
                  >
                    Usuń
                  </Button>
                </Box>
              </Box>
            ))}
            <Typography
              variant="subtitle1"
              sx={{ textAlign: "right", marginTop: 2 }}
            >
              Łączna cena: {totalPrice} zł
            </Typography>
            <Button
              sx={{
                textAlign: "left",
                backgroundColor: "#800000",
                "&:hover": {
                  backgroundColor: "red",
                },
              }}
              variant="contained"
              onClick={handleOrder}
            >
              Zamów
            </Button>
          </>
        ) : (
          <Typography variant="body2">Koszyk pusty</Typography>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Menu>
  );
};

export default Cart;
