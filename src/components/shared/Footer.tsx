import { Box, Text, Divider } from "@mantine/core";
// import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box component="footer" className="bg-[#102041] text-white">
      <Divider className="border-gray-600" />
      <Box className="max-w-7xl mx-auto px-6 py-4">
        {/* Links Section */}
        {/* <Box className="mb-4 flex gap-4 justify-center">
          <Link
            to="/privacy"
            className="text-gray-300 hover:text-white text-sm"
          >
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-gray-300 hover:text-white text-sm">
            Terms of Service
          </Link>
          <Link
            to="/contact"
            className="text-gray-300 hover:text-white text-sm"
          >
            Contact Us
          </Link>
        </Box> */}
        {/* Footer Text */}
        <Text ta="center" className="text-gray-400 text-sm">
          &copy; 2024 Infozillion. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;
