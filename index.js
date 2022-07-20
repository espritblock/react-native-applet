import React from 'react';
import ReactNative from 'react-native';
import 'react-native-gesture-handler';
import 'lottie-react-native';
import BottomTabs from '@react-navigation/bottom-tabs';
import Drawers from '@react-navigation/drawer';
import MaterialBottomTabs from '@react-navigation/material-bottom-tabs';
import MaterialTopTabs from '@react-navigation/material-top-tabs';
import Native from '@react-navigation/native';
import NativeStack from '@react-navigation/native-stack';
import Lottie from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import Idle from 'react-native-idle-timer';
import Localization from 'react-native-localization';
import PaperView from 'react-native-pager-view';
import {Provider,Colors,useTheme, withTheme, ThemeProvider,DefaultTheme,DarkTheme,shadow,overlay,configureFonts,Avatar,Drawer,Badge,ActivityIndicator,Banner,BottomNavigation,Button,Card,Checkbox,Chip,DataTable,Dialog,Divider,FAB,AnimatedFAB,HelperText,IconButton,Menu,Modal,Portal,ProgressBar,RadioButton,Searchbar,Snackbar,Surface,Switch,Appbar,TouchableRipple,TextInput,ToggleButton,Caption,Headline,Paragraph,Subheading,Title,Text} from 'react-native-paper';
import Qrcode from 'react-native-qrcode-svg';
import Screens from 'react-native-screens';
import Share from 'react-native-share';
import Svg from 'react-native-svg';
import TabView from 'react-native-tab-view';
import Icons from 'react-native-vector-icons';
import ViewShot from 'react-native-view-shot';
import Webview from 'react-native-webview';
module.exports = {
    React,
    Native:ReactNative,
    MaterialUI:{TabView,PaperView,Provider,Colors,useTheme, withTheme, ThemeProvider,DefaultTheme,DarkTheme,shadow,overlay,configureFonts,Avatar,Drawer,Badge,ActivityIndicator,Banner,BottomNavigation,Button,Card,Checkbox,Chip,DataTable,Dialog,Divider,FAB,AnimatedFAB,HelperText,IconButton,Menu,Modal,Portal,ProgressBar,RadioButton,Searchbar,Snackbar,Surface,Switch,Appbar,TouchableRipple,TextInput,ToggleButton,Caption,Headline,Paragraph,Subheading,Title,Text},
    Navigation:{Native,NativeStack,BottomTabs,Drawer:Drawers,MaterialBottomTabs,MaterialTopTabs},
    Lottie,
    FastImage,
    Idle,
    Localization,
    Qrcode,
    Screens,
    Share,
    Svg,
    Icons,
    ViewShot,
    Webview
}