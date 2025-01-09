import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationDetails from '../components/location/LocationDetails';
import locations from '../data/staticLocations';

describe('LocationDetails Component', () => {
  const mockLocation = locations[0]; // Using Bangkok as test data

  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      render(<LocationDetails location={mockLocation} />, { container });
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  describe('Basic Rendering', () => {
    test('renders location name and description', () => {
      const name = container.querySelector('h1');
      const description = container.querySelector('p.text-gray-600');
      expect(name).toHaveTextContent(mockLocation.name);
      expect(description).toHaveTextContent(mockLocation.description);
    });

    test('renders all section headers', () => {
      const headers = container.querySelectorAll('h2');
      const headerTexts = Array.from(headers).map(h => h.textContent);
      expect(headerTexts).toContain('Photo Gallery');
      expect(headerTexts).toContain('Videos');
      expect(headerTexts).toContain('Reviews');
      expect(headerTexts).toContain('Highlights');
      expect(headerTexts).toContain('Features');
      expect(headerTexts).toContain('Points of Interest');
    });
  });

  describe('Photo Gallery', () => {
    test('displays loading state for photos', () => {
      const loadingLocation = { ...mockLocation, photos: undefined };
      act(() => {
        render(<LocationDetails location={loadingLocation} />);
      });
      const headers = container.querySelectorAll('h2');
      const photoGalleryHeader = Array.from(headers).find(h => h.textContent === 'Photo Gallery');
      expect(photoGalleryHeader).toBeTruthy();
    });

    test('photo caption is visible and matches current photo', () => {
      const firstPhoto = mockLocation.photos[0];
      const caption = screen.getByTestId('photo-gallery-caption');
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveClass('absolute', 'bottom-0', 'bg-black', 'bg-opacity-50', 'text-white');
    });

    test('navigation buttons are accessible', () => {
      const nextButton = screen.getByTestId('photo-gallery-next-button');
      const prevButton = screen.getByTestId('photo-gallery-prev-button');
      
      expect(nextButton).toHaveClass('bg-black', 'bg-opacity-50', 'text-white', 'rounded-full');
      expect(prevButton).toHaveClass('bg-black', 'bg-opacity-50', 'text-white', 'rounded-full');
    });
    test('displays first photo by default', () => {
      const firstPhoto = mockLocation.photos[0];
      const img = screen.getByTestId('photo-gallery-image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', firstPhoto.url);
    });

    test('navigation buttons change photos', async () => {
      const nextButton = screen.getByLabelText('Next photo');
      const prevButton = screen.getByLabelText('Previous photo');
      const firstPhotoCaption = 'The magnificent Grand Palace complex';
      const secondPhotoCaption = 'Wat Arun temple at sunset';

      expect(container.querySelector('[data-testid="photo-gallery-caption"]')).toHaveTextContent(firstPhotoCaption);
      
      await act(async () => {
        fireEvent.click(nextButton);
      });
      expect(container.querySelector('[data-testid="photo-gallery-caption"]')).toHaveTextContent(secondPhotoCaption);
      
      await act(async () => {
        fireEvent.click(prevButton);
      });
      const caption = container.querySelector('[data-testid="photo-gallery-caption"]');
      expect(caption).toHaveTextContent(firstPhotoCaption);
    });

    test('photo navigation wraps around', async () => {
      const nextButton = screen.getByLabelText('Next photo');
      const lastPhotoCaption = 'Bustling Chatuchak Weekend Market';
      const firstPhotoCaption = 'The magnificent Grand Palace complex';
      
      // Click next until we reach the last photo
      for (const _ of mockLocation.photos) {
        await act(async () => {
          fireEvent.click(nextButton);
        });
      }
      
      expect(container.querySelector('[data-testid="photo-gallery-caption"]')).toHaveTextContent(lastPhotoCaption);
      
      // Click next again to wrap to first photo
      await act(async () => {
        fireEvent.click(nextButton);
      });
      const caption = container.querySelector('[data-testid="photo-gallery-caption"]');
      expect(caption).toHaveTextContent(firstPhotoCaption);
    });
  });

  describe('Video Player', () => {
    test('displays loading state for videos', () => {
      const loadingLocation = { ...mockLocation, videos: undefined };
      act(() => {
        render(<LocationDetails location={loadingLocation} />);
      });
      const headers = container.querySelectorAll('h2');
      const videosHeader = Array.from(headers).find(h => h.textContent === 'Videos');
      expect(videosHeader).toBeTruthy();
    });

    test('video player has correct attributes', () => {
      const firstVideo = mockLocation.videos[0];
      const video = screen.getByTestId('video-player');
      
      expect(video).toHaveAttribute('controls');
      expect(video).toHaveClass('w-full', 'rounded-lg');
    });

    test('video navigation buttons are only shown when multiple videos exist', () => {
      const singleVideoLocation = { ...mockLocation, videos: [mockLocation.videos[0]] };
      act(() => {
        render(<LocationDetails location={singleVideoLocation} />);
      });
      
      expect(screen.queryByText('Next Video')).not.toBeInTheDocument();
      expect(screen.queryByText('Previous Video')).not.toBeInTheDocument();
    });

    test('video navigation wraps around correctly', async () => {
      if (mockLocation.videos.length > 1) {
        const nextButton = screen.getByText('Next Video');
        const lastVideoTitle = mockLocation.videos[mockLocation.videos.length - 1].title;
        
        // Click next until we reach the last video
        for (const _ of mockLocation.videos) {
          await act(async () => {
            fireEvent.click(nextButton);
          });
        }
        
        expect(container.querySelector('[data-testid="video-title"]')).toHaveTextContent(lastVideoTitle);
        
        // Click next again to wrap to first video
        await act(async () => {
          fireEvent.click(nextButton);
        });
        const videoTitle = container.querySelector('[data-testid="video-title"]');
        expect(videoTitle).toHaveTextContent(mockLocation.videos[0].title);
      }
    });
    test('displays first video by default', () => {
      const firstVideo = mockLocation.videos[0];
      const video = screen.getByTitle(firstVideo.title);
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('src', firstVideo.url);
    });

    test('video navigation works correctly', async () => {
      if (mockLocation.videos.length > 1) {
        const nextButton = screen.getByTestId('video-next-button');
        const prevButton = screen.getByTestId('video-prev-button');
        const firstVideoTitle = mockLocation.videos[0].title;
        const secondVideoTitle = mockLocation.videos[1].title;

        expect(container.querySelector('[data-testid="video-title"]')).toHaveTextContent(firstVideoTitle);
        
        await act(async () => {
          fireEvent.click(nextButton);
        });
        expect(container.querySelector('[data-testid="video-title"]')).toHaveTextContent(secondVideoTitle);
        
        await act(async () => {
          fireEvent.click(prevButton);
        });
        const videoTitle = container.querySelector('[data-testid="video-title"]');
        expect(videoTitle).toHaveTextContent(firstVideoTitle);
      }
    });
  });

  describe('Reviews Section', () => {
    test('displays average rating correctly', () => {
      const avgRating = mockLocation.reviews.reduce((acc, review) => acc + review.rating, 0) / mockLocation.reviews.length;
      expect(screen.getByText(`Average Rating: ${avgRating.toFixed(1)} / 5`)).toBeInTheDocument();
    });

    test('renders all reviews', () => {
      mockLocation.reviews.forEach(review => {
        expect(screen.getByText(review.author)).toBeInTheDocument();
        expect(screen.getByText(review.comment)).toBeInTheDocument();
      });
    });

    test('renders review cards with proper styling', () => {
      const reviewCards = container.querySelectorAll('.bg-gray-50.p-4.rounded-lg');
      expect(reviewCards.length).toBe(mockLocation.reviews.length);
      
      reviewCards.forEach(card => {
        expect(card).toHaveClass('bg-gray-50', 'p-4', 'rounded-lg');
        expect(card.querySelector('.font-medium')).toBeInTheDocument(); // Author name
        expect(card.querySelector('.text-gray-600')).toBeInTheDocument(); // Review comment
      });
    });

    test('renders star ratings correctly', () => {
      mockLocation.reviews.forEach(review => {
        const reviewElement = screen.getByText(review.author).closest('.bg-gray-50');
        const stars = reviewElement.querySelector('.flex.items-center');
        
        const filledStars = stars.querySelector('.text-yellow-500').textContent.length;
        const emptyStars = stars.querySelector('.text-gray-300').textContent.length;
        
        expect(filledStars).toBe(review.rating);
        expect(emptyStars).toBe(5 - review.rating);
      });
    });

    test('calculates average rating with no reviews', () => {
      const noReviewsLocation = { ...mockLocation, reviews: [] };
      act(() => {
        render(<LocationDetails location={noReviewsLocation} />);
      });
      expect(screen.getByText('Average Rating: 0 / 5')).toBeInTheDocument();
    });
  });

  describe('Highlights and Features', () => {
    test('renders highlights grid layout correctly', () => {
      const highlightsGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-4');
      expect(highlightsGrid).toBeInTheDocument();
      
      const highlightItems = highlightsGrid.querySelectorAll('li');
      expect(highlightItems.length).toBe(mockLocation.highlights.length);
      
      highlightItems.forEach(item => {
        expect(item).toHaveClass('bg-blue-50', 'p-4', 'rounded-lg', 'flex', 'items-center');
        expect(item.querySelector('.text-blue-500')).toBeInTheDocument(); // Bullet point
      });
    });

    test('renders all highlights with proper content', () => {
      mockLocation.highlights.forEach(highlight => {
        const highlightElement = screen.getByText(highlight);
        const listItem = highlightElement.closest('li');
        expect(listItem).toHaveClass('bg-blue-50', 'p-4', 'rounded-lg');
      });
    });

    test('renders features list with proper styling', () => {
      const featuresContainer = container.querySelector('.flex.flex-wrap.gap-2');
      expect(featuresContainer).toBeInTheDocument();
      
      const featureItems = featuresContainer.querySelectorAll('span');
      expect(featureItems.length).toBe(mockLocation.features.length);
      
      featureItems.forEach(item => {
        expect(item).toHaveClass('bg-gray-200', 'px-3', 'py-1', 'rounded-full', 'text-sm');
      });
    });

    test('renders all features with proper content', () => {
      mockLocation.features.forEach(feature => {
        const featureElement = screen.getByText(feature);
        expect(featureElement).toHaveClass('bg-gray-200', 'px-3', 'py-1', 'rounded-full', 'text-sm');
      });
    });

    test('handles empty highlights and features gracefully', () => {
      const emptyLocation = { ...mockLocation, highlights: [], features: [] };
      act(() => {
        render(<LocationDetails location={emptyLocation} />);
      });
      
      const highlightsSection = screen.getByText('Highlights').parentElement;
      const featuresSection = screen.getByText('Features').parentElement;
      
      expect(highlightsSection).toBeInTheDocument();
      expect(featuresSection).toBeInTheDocument();
    });

    test('handles undefined highlights and features gracefully', () => {
      const undefinedLocation = { ...mockLocation, highlights: undefined, features: undefined };
      act(() => {
        render(<LocationDetails location={undefinedLocation} />);
      });
      
      const highlightsSection = screen.getByText('Highlights').parentElement;
      const featuresSection = screen.getByText('Features').parentElement;
      
      expect(highlightsSection).toBeInTheDocument();
      expect(featuresSection).toBeInTheDocument();
      expect(highlightsSection.querySelector('ul')).toBeInTheDocument();
      expect(featuresSection.querySelector('.flex.flex-wrap')).toBeInTheDocument();
    });

    test('highlights grid is responsive', () => {
      const highlightsGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-4');
      expect(highlightsGrid).toBeInTheDocument();
      expect(highlightsGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4');
    });

    test('features wrap correctly on small screens', () => {
      const featuresContainer = container.querySelector('.flex.flex-wrap.gap-2');
      expect(featuresContainer).toBeInTheDocument();
      expect(featuresContainer).toHaveClass('flex', 'flex-wrap', 'gap-2');
      
      // Add many features to test wrapping
      const manyFeaturesLocation = {
        ...mockLocation,
        features: Array(10).fill('').map((_, i) => `Feature ${i + 1}`)
      };
      act(() => {
        render(<LocationDetails location={manyFeaturesLocation} />);
      });
      
      const featureElements = screen.getAllByText(/Feature \d+/);
      expect(featureElements.length).toBe(10);
      featureElements.forEach(element => {
        expect(element).toHaveClass('bg-gray-200', 'px-3', 'py-1', 'rounded-full', 'text-sm');
      });
    });

    test('highlights maintain consistent spacing', () => {
      const highlightsGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-4');
      expect(highlightsGrid).toHaveClass('gap-4');
      
      const highlightItems = highlightsGrid.querySelectorAll('li');
      highlightItems.forEach(item => {
        expect(item).toHaveClass('p-4');
      });
    });

    test('features maintain consistent spacing', () => {
      const featuresContainer = container.querySelector('.flex.flex-wrap.gap-2');
      expect(featuresContainer).toHaveClass('gap-2');
      
      const featureItems = featuresContainer.querySelectorAll('span');
      featureItems.forEach(item => {
        expect(item).toHaveClass('px-3', 'py-1');
      });
    });

    test('highlights and features sections maintain proper vertical spacing', () => {
      const highlightsSection = screen.getByText('Highlights').parentElement;
      const featuresSection = screen.getByText('Features').parentElement;
      
      expect(highlightsSection).toHaveClass('space-y-8');
      expect(featuresSection).toHaveClass('space-y-8');
    });
  });

  describe('Points of Interest', () => {
    test('renders all points of interest', () => {
      mockLocation.pointsOfInterest.forEach(poi => {
        expect(screen.getByText(poi.name)).toBeInTheDocument();
        expect(screen.getByText(poi.description)).toBeInTheDocument();
        expect(screen.getByText(`Coordinates: ${poi.coordinates.lat}, ${poi.coordinates.lng}`)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles missing photos gracefully', () => {
      const locationWithoutPhotos = { ...mockLocation, photos: [] };
      act(() => {
        render(<LocationDetails location={locationWithoutPhotos} />);
      });
      expect(screen.getByText('Photo Gallery')).toBeInTheDocument();
    });

    test('handles missing videos gracefully', () => {
      const locationWithoutVideos = { ...mockLocation, videos: [] };
      act(() => {
        render(<LocationDetails location={locationWithoutVideos} />);
      });
      expect(screen.getByText('Videos')).toBeInTheDocument();
    });

    test('handles missing reviews gracefully', () => {
      const locationWithoutReviews = { ...mockLocation, reviews: [] };
      act(() => {
        render(<LocationDetails location={locationWithoutReviews} />);
      });
      expect(screen.getByText('Average Rating: 0 / 5')).toBeInTheDocument();
    });
  });
  describe('Accessibility', () => {
    test('all sections have proper headings', () => {
      const headings = container.querySelectorAll('h1, h2, h3');
      headings.forEach(heading => {
        expect(heading).toHaveAttribute('class');
        expect(heading.textContent.trim()).not.toBe('');
      });
    });

    test('photo gallery controls are keyboard accessible', () => {
      const nextButton = screen.getByTestId('photo-gallery-next-button');
      const prevButton = screen.getByTestId('photo-gallery-prev-button');

      nextButton.focus();
      expect(document.activeElement).toBe(nextButton);
      
      prevButton.focus();
      expect(document.activeElement).toBe(prevButton);
    });

    test('video player controls are keyboard accessible', () => {
      if (mockLocation.videos.length > 1) {
        const nextButton = screen.getByTestId('video-next-button');
        const prevButton = screen.getByTestId('video-prev-button');

        nextButton.focus();
        expect(document.activeElement).toBe(nextButton);
        
        prevButton.focus();
        expect(document.activeElement).toBe(prevButton);
      }
    });

    test('images have alt text', () => {
      const images = container.querySelectorAll('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });

    test('videos have titles', () => {
      const videos = container.querySelectorAll('video');
      videos.forEach(video => {
        expect(video).toHaveAttribute('title');
        expect(video.getAttribute('title')).not.toBe('');
      });
    });
  });
});
