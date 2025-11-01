import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "var(--primary-color)",
        color: "white",
        textAlign: "center",
        padding: "1.5rem 0",
        width: "100%",
        marginTop: "10%",
      }}
    >
      <Typography variant="h6">
        Culturify © {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}

export default Footer;
