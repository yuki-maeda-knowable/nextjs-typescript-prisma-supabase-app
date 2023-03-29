import { AddAPhoto } from "@mui/icons-material";
import Layout from "../../components/Layout";
import {
  Container,
  Typography,
  Box,
  TextField,
  Avatar,
  Stack,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";

interface profile {
  nickname: string;
  photo: [];
  userId: string;
}

const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<profile>({
    defaultValues: {
      nickname: "",
      photo: [],
    },
  });
  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h6" color={`whitesmoke`}>
          Profile
        </Typography>

        <Stack component="form" alignItems="center">
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image="https://images.pexels.com/photos/371160/pexels-photo-371160.jpeg"
              title="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Lizard 21歳
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over
                6,000 species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Profile;
