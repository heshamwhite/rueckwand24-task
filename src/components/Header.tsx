import type {ReactElement} from "react";
import AppStyle from "../style/App.module.scss";
import {Box, Typography} from "@mui/material";
import logo from "../assets/R24.webp";
import search from "../assets/search-icon.svg";
import shoppingCart from "../assets/shopping-cart.png";

export function Header(): ReactElement {

    return (
        <Box className={AppStyle.header}>
            <Box className={AppStyle.headerLeft}>
                <img src={logo} alt="Rückwand24 Logo" className={AppStyle.logo} />
                <Typography className={AppStyle.siteTitle}>
                    Rückwand24
                </Typography>
            </Box>

            <Box className={AppStyle.navLinks}>
                <span>Produkte</span>
                <span>Konfigurator</span>
                <span>Galerie</span>
                <span>Über uns</span>
                <span>Kontakt</span>
            </Box>

            <Box className={AppStyle.headerRight}>
                <Box>
                    <img className={AppStyle.headerIcon} alt={"Search"} src={search} />
                </Box>
                <Box >
                    <img className={AppStyle.headerIcon} alt={"Shopping cart"} src={shoppingCart}/>
                </Box>
            </Box>
        </Box>
    )
}