// import { ActionIcon } from "@mantine/core";
// import { useContext } from "react";
// import colorSchemeContext from "../../colorSchemeContext";

// const ThemeToggler = () => {
//   const context = useContext(colorSchemeContext);
//   if (!context) {
//     throw new Error(
//       "ColorSchemeToggler must be used within a ColorSchemeProvider"
//     );
//   }
//   const { colorScheme, setColorScheme } = context;
//   const toggleColorScheme = () => {
//     setColorScheme(colorScheme === "dark" ? "light" : "dark");
//   };

//   return (
//     <ActionIcon
//       variant="outline"
//       color={colorScheme === "dark" ? "yellow" : "blue"}
//       onClick={toggleColorScheme}
//       title="Toggle color scheme"
//     >
//       {colorScheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
//     </ActionIcon>
//   );
// };

// export default ThemeToggler;
