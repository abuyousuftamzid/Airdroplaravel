import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
    Chip,
    useTheme
} from '@mui/material';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// from mui icons
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const ImageSliderCard = () => {
    const theme = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        {
            id: 1,
            image: 'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/cover/cover-4.webp',
            tag: 'FEATURED APP',
            title: 'The Rise of Remote Work: Benefits, Challenges, and Future Trends',
            description: 'The aroma of freshly brewed coffee filled the air, awakening my senses.'
        },
        {
            id: 2,
            image: 'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/cover/cover-6.webp',
            tag: 'FEATURED APP',
            title: 'Understanding Blockchain Technology: Beyond Cryptocurrency',
            description: 'The children giggled with joy as they ran through the sprinklers on a hot summer day.'
        },
        {
            id: 3,
            image: 'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/cover/cover-5.webp',
            tag: 'FEATURED APP',
            title: 'Mental Health in the Digital Age: Navigating Social Media and Well-being',
            description: 'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.'
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    // Auto-slide functionality
    // useEffect(() => {
    //     const interval = setInterval(nextSlide, 5000);
    //     return () => clearInterval(interval);
    // }, []);

    const currentSlide = slides[currentIndex];

    return (
        <Box sx={{ margin: '0 auto', position: 'relative' }}>
            <Card
                sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    height: 300,
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `url(${currentSlide.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '10%',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,11) 100%)',
                        opacity: 0.8,
                        zIndex: 1
                    }
                }}
            >
                {/* Wave Animation Background */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '42%',
                        zIndex: 1,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '100%',
                            background: `
                radial-gradient(ellipse 100% 100% at 50% 120%, rgba(168, 85, 247, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse 80% 80% at 30% 110%, rgba(14, 165, 233, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse 120% 120% at 70% 115%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse 90% 90% at 20% 100%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)
              `,
                            animation: 'waveFloat 6s ease-in-out infinite alternate',
                            '@keyframes waveFloat': {
                                '0%': {
                                    transform: 'translateY(0px) scale(1)',
                                },
                                '100%': {
                                    transform: 'translateY(-10px) scale(1.05)',
                                }
                            }
                        }
                    }}
                />

                {/* Dots Indicator - Left Side */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 21,
                        left: 24,
                        display: 'flex',
                        gap: 1,
                        zIndex: 3
                    }}
                >
                    {slides.map((_, index) => (
                        <Box
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: index === currentIndex ? '#00ff88' : 'rgba(255,255,255,0.4)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: index === currentIndex ? '#00ff88' : 'rgba(255,255,255,0.6)',
                                }
                            }}
                        />
                    ))}
                </Box>

                {/* Navigation Arrows - Right Side */}
                <IconButton
                    onClick={prevSlide}
                    sx={{
                        position: 'absolute',
                        right: 48,
                        top: 16,
                        zIndex: 3,
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        backgroundColor: 'none',
                        width: 32,
                        height: 32,
                    }}
                >
                    <ChevronLeft />
                </IconButton>

                <IconButton
                    onClick={nextSlide}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        zIndex: 3,
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        width: 32,
                        height: 32,
                    }}
                >
                    <ChevronRight />
                </IconButton>

                <CardContent
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 2,
                        color: 'white',
                        padding: 3,
                        background: 'transparent'
                    }}
                >
                    <div className='flex flex-col gap-2 items-start'>
                        <Chip
                            label={currentSlide.tag}
                            sx={{
                                color: '#5be49b',
                                backgroundColor: 'none',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                lineHeight: '18px',
                                '& .MuiChip-label': {
                                    padding: '0px'
                                }
                            }}
                        />

                        <Typography
                            variant="a"
                            component="a"
                            sx={{
                                fontWeight: 'bold',
                                lineHeight: '29px',
                                fontSize: '19px',
                                color: '#fff',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                maxHeight: '58px'
                            }}
                        >
                            {currentSlide.title}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                lineHeight: '22px',
                                fontSize: '14px',
                                color: '#fff',
                                fontWeight: '400',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                maxHeight: '44px'
                            }}
                        >
                            {currentSlide.description}
                        </Typography>
                    </div>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ImageSliderCard;
