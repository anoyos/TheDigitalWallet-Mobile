//
//  SNSThemeSection.h
//  IdensicMobileSDK
//

#import <Foundation/Foundation.h>

#ifndef SNS_THEME_DEPRECATED
    #ifndef SNS_THEME_SUPPRESS_DEPRECATED_WARNINGS
        #define SNS_THEME_DEPRECATED(params...) __attribute((deprecated(params)))
    #else
        #define SNS_THEME_DEPRECATED(params...)
    #endif
#endif

typedef NSString * SNSVerificationStepKey NS_TYPED_EXTENSIBLE_ENUM;
extern SNSVerificationStepKey _Nonnull const SNSVerificationStepKeyDefault;
extern SNSVerificationStepKey _Nonnull const SNSVerificationStepKeyIdentity;
extern SNSVerificationStepKey _Nonnull const SNSVerificationStepKeyIdentity2;
extern SNSVerificationStepKey _Nonnull const SNSVerificationStepKeyIdentity3;
extern SNSVerificationStepKey _Nonnull const SNSVerificationStepKeyIdentity4;
extern SNSVerificationStepKey _Nonnull const SNSVerificationStepKeySelfie;
extern SNSVerificationStepKey _Nonnull const SNSVerificationStepKeySelfie2;
extern SNSVerificationStepKey _Nonnull const SNSVerificationStepKeyProofOfResidence;
extern SNSVerificationStepKey _Nonnull const SNSVerificationStepKeyProofOfResidence2;
extern SNSVerificationStepKey _Nonnull const SNSVerificationStepKeyApplicantData;
extern SNSVerificationStepKey _Nonnull const SNSVerificationStepKeyEmailVerification;
extern SNSVerificationStepKey _Nonnull const SNSVerificationStepKeyPhoneVerification;

typedef NSString * SNSDocumentTypeKey NS_TYPED_EXTENSIBLE_ENUM;
extern SNSDocumentTypeKey _Nonnull const SNSDocumentTypeKeyDefault;
extern SNSDocumentTypeKey _Nonnull const SNSDocumentTypeKeyIdCard;
extern SNSDocumentTypeKey _Nonnull const SNSDocumentTypeKeyPassport;
extern SNSDocumentTypeKey _Nonnull const SNSDocumentTypeKeyDrivers;
extern SNSDocumentTypeKey _Nonnull const SNSDocumentTypeKeyResidencePermit;

typedef NSString * SNSSceneType NS_TYPED_EXTENSIBLE_ENUM;
extern SNSSceneType _Nonnull const SNSSceneTypeFacescan;
extern SNSSceneType _Nonnull const SNSSceneTypeVideoSelfie;
extern SNSSceneType _Nonnull const SNSSceneTypePhotoSelfie;
extern SNSSceneType _Nonnull const SNSSceneTypeScanFrontSide;
extern SNSSceneType _Nonnull const SNSSceneTypeScanBackSide;
extern SNSSceneType _Nonnull const SNSSceneTypeData;
extern SNSSceneType _Nonnull const SNSSceneTypeConfirmation;

typedef NSString * SNSInstructionsBlockType NS_TYPED_EXTENSIBLE_ENUM;
extern SNSInstructionsBlockType _Nonnull const SNSInstructionsBlockTypeSingle;
extern SNSInstructionsBlockType _Nonnull const SNSInstructionsBlockTypeDo;
extern SNSInstructionsBlockType _Nonnull const SNSInstructionsBlockTypeDont;

@interface SNSThemeSection : NSObject

@end
