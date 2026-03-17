import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

export default function ImageUpload({ value, onChange }) {
  const [preview, setPreview] = useState(value || "");
  const [verificationResult, setVerificationResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const inputRef = useRef(null);

const handleFile = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Show preview
  const reader = new FileReader();
  reader.onloadend = () => {
    const result = reader.result;
    setPreview(result);
    onChange(result);
  };
  reader.readAsDataURL(file);

  // Run AI detection
  setChecking(true);
  setVerificationResult(null);
  try {
    const formData = new FormData();
    formData.append("image", file);

    console.log("Sending file:", file.name, file.type, file.size);

    const res = await fetch("/api/reports/submit", {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", res.status);
    const text = await res.text();
    console.log("Raw response:", text);

    const data = JSON.parse(text);
    console.log("Verification result:", data.verification);
    setVerificationResult(data.verification);
  } catch (err) {
    console.error("Verification failed:", err);
  } finally {
    setChecking(false);
  }
};

  const clear = () => {
    setPreview("");
    onChange("");
    setVerificationResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={clear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Click to upload an image</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {/* Checking spinner */}
      {checking && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking image for AI generation...
        </div>
      )}

      {/* AI detected warning */}
      {!checking && verificationResult?.recommendation === "flag_for_review" && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">AI-generated image detected ({verificationResult.confidenceScore}% confidence)</p>
            <p className="text-xs mt-1">Please upload a real photo of the issue.</p>
          </div>
        </div>
      )}

      {/* Needs review warning */}
      {!checking && verificationResult?.recommendation === "warn_submitter" && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Image needs review ({verificationResult.confidenceScore}% suspicion)</p>
            <p className="text-xs mt-1">Your report will be reviewed by our team before publishing.</p>
            {verificationResult.flags.map((f) => (
              <p key={f} className="text-xs mt-0.5">• {f}</p>
            ))}
          </div>
        </div>
      )}

      {/* All good */}
      {!checking && verificationResult?.recommendation === "approve" && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <p className="font-medium">Image looks authentic — good to go!</p>
        </div>
      )}
    </div>
  );
}