import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
// import { fetchSchoolReviews, saveReview, likeDislikeReview } from "@/redux/slices/reviewSlice";
import { AntDesign } from "@expo/vector-icons";
import { fetchSchoolReviews, submitReview, toggleLikeReview } from "../../redux/slices/reviewSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { Colors } from "../../utils";
import { useNavigation } from "@react-navigation/native";
import MyTextArea from "../MyTextArea";
import Button from "../Button";
import { saveReview } from "../../api/reviewApis";
import ImagePath from "../../assets/images/ImagePath";
interface GuestReviewProps {
    school: any;
  }
export default function GuestReview({ school }: GuestReviewProps) {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
  const { reviews, loading } = useSelector(
    (state: RootState) => state.reviewSlice
  );
  const { user } = useSelector(
    (state: RootState) => state.auth
  );
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});
  const [comment, setComment] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if(school?._id)
      {
        dispatch(fetchSchoolReviews(school._id));
      }
   
  }, [dispatch,school?._id]);

  const handleLikeDislike = async (reviewId:any, action:any) => {
   if(!user)
    {
        navigation.navigate("Login");
    }
    await dispatch(toggleLikeReview({ reviewId, action }));
  };

  const validateForm = () => {
    const newErrors: { rating?: string; comment?: string } = {};
    if (rating === 0) newErrors.rating = "Please provide a rating";
    if (!comment.trim()) newErrors.comment = "Please write something in 'Your Thoughts'";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    dispatch(submitReview({ rating, comment, schoolId: school._id }));
    setRating(0);
    setComment("");
    setErrors({});
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <View >
      {reviews.length === 0 ? (
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>No Reviews given for this School</Text>
      ) : (
        <>
          <Text style={styles.schoolName}>Reviews</Text>
          <FlatList
            data={displayedReviews}
            nestedScrollEnabled={true} 
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image  source={item.user?.profileImage ? { uri: item.user.profileImage } : ImagePath.defaultAvatar} style={styles.profileImage} />
                  <View>
                    <Text style={{ fontWeight: "bold" }}>{item.user?.name}</Text>
                    <Text>{new Date(item.reviewDate).toLocaleDateString()}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  {[...Array(5)].map((_, index) => (
                    <AntDesign key={index} name={index < item.rating ? "star" : "staro"} size={18} color="gold" />
                  ))}
                </View>
                <Text style={{ marginTop: 10 }}>{item.comment}</Text>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <TouchableOpacity onPress={() => handleLikeDislike(item._id, "like")}>
                    <Text style={{ marginRight: 10 }}>👍 {item.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleLikeDislike(item._id, "dislike")}>
                    <Text>👎 {item.dislikes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          {reviews.length > 3 && (
            <TouchableOpacity onPress={() => setShowAllReviews(!showAllReviews)}>
              <Text style={{ color: Colors.primary, textAlign: "center", marginVertical: 10 }}>{showAllReviews ? "Show Less" : "View All Reviews"}</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {user ? (
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>Leave A Comment</Text>
          <Text>Your email address will not be published.</Text>
          <Text style={{ marginTop: 10 }}>Your Rating to this school</Text>
          <View style={{ flexDirection: "row", marginVertical: 10 }}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
                <AntDesign name={index < rating ? "star" : "staro"} size={30} color="gold" />
              </TouchableOpacity>
            ))}
          </View>
          {errors.rating && <Text style={{ color: "red" }}>{errors.rating}</Text>}
          <MyTextArea
                    label="Your Thoughts"
                    placeholder="Write a comment"
                    value={comment}
                    onChange={setComment}
                />
         
          {errors.comment && <Text style={{ color: "red" }}>{errors.comment}</Text>} 
 <Button label="Post Comment" onPress={handleSubmit} />
        </View>
      ) : (
        <Text style={{ textAlign: "center", color: "blue", marginTop: 20 }}>Please Login to Leave A Comment</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
    schoolName: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical:10
      },
      reviewCard:{
        paddingVertical: 20, borderBottomWidth: 1, borderColor: Colors.grayShade1
      },
      profileImage:{
        width: 50, height: 50, borderRadius: 25, marginRight: 10
      }
})
