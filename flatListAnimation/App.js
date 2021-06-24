import * as React from 'react';
import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Easing,
  SafeAreaViewBase,
  SafeAreaView,
  
} from 'react-native';
const {width, height} = Dimensions.get('screen');

const API_KEY = '563492ad6f91700001000001192272edb02d4ae2947c3bcb114b8491';
const API_URL =
  'https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20';
const IMAGE_SIZE = 80;
const SPACING = 10;

const fetchImageFromPixels = async () => {
  const data = await fetch(API_URL, {
    headers: {
      Authorization: API_KEY,
    },
  });

  const {photos} = await data.json();
  return photos;
};
export default () => {
  const [images, setImages] = React.useState(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  React.useEffect(() => {
    const fetchImages = async () => {
      const images = await fetchImageFromPixels();
      setImages(images);
      console.log('images >>>> ', images);
    };

    fetchImages();
  }, []);

  const topref = React.useRef();
  const thumbref = React.useRef();

  const scrollToActiveIndex = index => {
    setActiveIndex(index);

    //part where we will scroll the below flatlist to center if that item is greater 
    //then the middle of screen 205.714
    console.log('width >>> ',width,' >>> index >>> ',index,' >>> IMAGE_SIZE >>> ',IMAGE_SIZE)
    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      
      thumbref?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) -width/2 + IMAGE_SIZE / 2,
        animated:true
      })
    } else {
      thumbref?.current?.scrollToOffset({
        offset: 0,
        animated:true
      })
    }

  };

  if (!images) {
    return <Text>loading .... </Text>;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        ref={topref}
        data={images}
        horizontal
        pagingEnabled
        //will fetch the active index
        onMomentumScrollEnd={env => {
          
          scrollToActiveIndex(Math.floor(env.nativeEvent.contentOffset.x / width));
        }}
        showHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => {
          return (
            <View style={{width, height}}>
              <Image
                source={{uri: item.src.portrait}}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
          );
        }}
      />

      <FlatList
        ref={thumbref}
        data={images}
        horizontal
        showHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        style={{position: 'absolute', bottom: IMAGE_SIZE}}
        contentContainerStyle={{paddingHorizontal: SPACING}}
        renderItem={({item,index}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                scrollToActiveIndex(index)
                topref?.current?.scrollToOffset({
                  offset: index * width,
                  animated:true,
                })
            }}
            >
            <Image
              source={{uri: item.src.portrait}}
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: 12,
                marginRight: SPACING,
                borderWidth: 2,
                borderColor:activeIndex===index ? '#fff':null
              }}
              />
              </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
