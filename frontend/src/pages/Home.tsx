import React from 'react';
import LandingPage from './LandingPage';
import { Container, Typography, Box, Button, Card, CardContent, CardMedia, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import SampleCase from '../components/SampleCase';
import { getUserInfo } from '../utils/user';
const placeholderImg = 'https://source.unsplash.com/400x300/?fruit,peach';
const placeholderImg2 = 'https://source.unsplash.com/400x300/?drink,glass';
const placeholderImg3 = 'https://source.unsplash.com/400x300/?vegetable';

const sampleCases = [
  {
    title: 'Academic',
    author: 'Author',
    image: placeholderImg3
  },
  {
    title: 'half - half',
    author: 'Author',
    image: placeholderImg
  },
  {
    title: 'Industry',
    author: 'Author',
    image: placeholderImg2
  }
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  // 判断是否登录
  const isLoggedIn = Boolean(getUserInfo());

  const handleInquiryClick = () => {
    navigate('/inquiry');
  };

  // if (isLoggedIn) {
  //   return <LandingPage />;
  // }

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ pt: 4, flex: 1 }}>
        {/* 主标题区 */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            让你的移民之路，少受气，少点坑
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            欢迎词 - 很短的slogan/副标题，传达：给你专属的N对1服务，专业、高效，我们明明白白做decision/意见人的角色，专业团队，专业判断
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ borderRadius: 2, fontWeight: 700 }}
            onClick={handleInquiryClick}
          >
            First Step Inquiry
          </Button>
        </Box>

        {/* 流程卡片 */}
        <Paper sx={{ p: 4, mb: 6, backgroundImage: `url(${placeholderImg2})`, backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff', borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            这里写一个最overall的workflow
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            1. inquiry - 3天内出结果<br />
            2. 如果positive，会议确认想申<br />
            3. 双方ok，确认价格+时间线，签合同<br />
            4. filing
          </Typography>
        </Paper>

        {/* 痛点区 */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            我们了解你的痛苦
          </Typography>
          <Grid container spacing={2} alignItems="stretch">
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardMedia component="img" height="160" image={placeholderImg} alt="痛点1" />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    你是不是怕我们拿钱不办事
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  我们和Pathlaw什么的，真的不一样，消息每天都回。
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardMedia component="img" height="160" image={placeholderImg2} alt="痛点2" />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    我们很认真地给你做strategy
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    用AI是肯定的，但是在一个弱case下，怎么standout，AI无法把握
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardMedia component="img" height="160" image={placeholderImg3} alt="痛点3" />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    失败了怎么办？
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    如果在合作过程中，你觉得我们还不错，愿意相信我们，我们半价
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* 优势区 */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                我们的优势
              </Typography>
              <Stack spacing={2} sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>真正专心</Typography>
                  <Typography variant="body2" color="text.secondary">不会让你写一大堆 1111111111111111111111</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>业界能力 - elaborate</Typography>
                  <Typography variant="body2" color="text.secondary">知道在哪里吹，怎么吹 1111111111111111111111</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>我们使用AI，但人来做decision</Typography>
                  <Typography variant="body2" color="text.secondary">就怕AI写的千人一面，工业界的case本来就难做，没点巧思不行</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <img src={placeholderImg} alt="优势" style={{ width: '100%', borderRadius: 16 }} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Sample Cases 区 */}
        <SampleCase cases={sampleCases} />
      </Container>
    </Box>
  );
};

export default Home; 