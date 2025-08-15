
import {Box} from "@mui/material";
import {ImageViewer} from "./components/ImageViewer.tsx";
import {CustomisationPane} from "./components/CustomisationPane.tsx";
import AppStyle from './style/App.module.scss';
import {Header} from "./components/Header.tsx";
function App() {

  return (
      <>
        <Header />
        <Box className={AppStyle.mainContainer}>
            <Box className={AppStyle.leftContainer}>
                <ImageViewer />
            </Box>
            <Box className={AppStyle.rightContainer}>
                <CustomisationPane />
            </Box>
        </Box>
      </>
  )
}

export default App
