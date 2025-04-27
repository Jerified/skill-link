/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillPostSchema } from "../../lib/schemas/authSchema";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { Loader2, ImageIcon, X } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";

const categories = [
  "Art",
  "Music",
  "Writing",
  "Coding",
  "Design",
  "Photography",
  "Cooking",
  "Other",
];

const FORM_STORAGE_KEY = "skilllink_post_draft";

// Define the form values type based on the schema
type FormValues = z.infer<typeof skillPostSchema>;

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { user } = useAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // const navigate = useNavigate();

  // Get saved form data from localStorage
  const getSavedFormData = (): FormValues => {
    try {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Error retrieving saved form data:", error);
    }
    return {
      title: "",
      description: "",
      category: "",
      image_url: "",
    };
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(skillPostSchema),
    defaultValues: getSavedFormData(),
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Check if user has a profile
  useEffect(() => {
    const checkProfile = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      setHasProfile(!!data && !error);
    };

    checkProfile();
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;


      // Try upload
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        // Handle bucket not existing
        if (
          uploadError.message.includes("bucket") ||
          uploadError.message.includes("not found")
        ) {
          // Create bucket
          const { error: createBucketError } =
            await supabase.storage.createBucket("post-images", {
              public: true,
            });

          if (createBucketError) throw createBucketError;

          // Retry upload with new bucket
          const { error: retryError } = await supabase.storage
            .from("post-images")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false
            });

          if (retryError) throw retryError;
        } else {
          throw uploadError;
        }
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(filePath);

      form.setValue("image_url", publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
      form.setValue("image_url", "");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };  
  const removeImage = () => {
    form.setValue("image_url", "");
    toast.info("Image removed");
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      if (!hasProfile) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
          name: user.email?.split("@")[0] || "New User",
          updated_at: new Date().toISOString(),
        });

        if (profileError) throw profileError;
        setHasProfile(true);
      }

      const { error } = await supabase.from("skill_posts").insert({
        ...values,
        user_id: user.id,
      });

      if (error) throw error;

      localStorage.removeItem(FORM_STORAGE_KEY);
      toast.success("Post created successfully!");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(FORM_STORAGE_KEY);
    form.reset({
      title: "",
      description: "",
      category: "",
      image_url: "",
    });
    toast.success("Draft cleared");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center w-full">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🔒</span>
        </div>
        <h3 className="text-xl font-medium mb-2">Authentication Required</h3>
        <p className="text-muted-foreground mb-4">
          You need to be logged in to create a post
        </p>
        <Button asChild>
          <Link to="/login">Login Now</Link>
        </Button>
      </div>
    );
  }

  const hasDraft = Object.values(form.getValues()).some(
    (value) => typeof value === "string" && value.trim() !== ""
  );
  const imageUrl = form.watch("image_url");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="p-6 sm:p-8">
        <div className="space-y-1 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Share Your Skill
            </h2>
            {hasDraft && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearDraft}
                className="text-xs text-black"
              >
                Clear Draft
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">
            Create a post to showcase your talent with the community
            {hasDraft && (
              <span className="ml-1 text-green-600 font-medium">
                (Draft saved)
              </span>
            )}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Professional Portrait Photography"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your skill, experience level, and what makes you unique..."
                      rows={5}
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-sm">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Featured Image (Optional)
                  </FormLabel>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="post-image"
                      disabled={isUploading}
                      {...field}
                    />
                    
                    {!imageUrl ? (
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors">
                        <label
                          htmlFor="post-image"
                          className="flex flex-col items-center justify-center cursor-pointer w-full"
                        >
                          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Recommended size: 1200x630 pixels
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className="overflow-hidden rounded-lg border">
                          <img
                            src={imageUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={removeImage}
                              className="ml-auto"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-11"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Post...
                  </>
                ) : (
                  "Publish Skill"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
