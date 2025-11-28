# Settings

## Google API Integration


> **Note:**
>
> This setup process is required **only once**. After successful configuration, the system will automatically maintain the Google Drive connection for future sessions.
>
>

**Google Drive Integration**


TabsyPOS allows seamless integration with **Google Drive** for secure data backup.


To enable this integration, you need to create a **Google Client ID** from the **Google Cloud Console**. Follow the steps below to complete the setup.


**Step 1: Create or Select a Project**

- Go to the [**Google Cloud Console**](https://console.cloud.google.com/).
- If you don’t have a project, click **“Create Project.”**
- Enter a project name — for example: **TabsyPOS** — and click **Create**.
- Location (Organisation), You can leave this as the default.

    ![New-Project--Google-Cloud-console-11-10-2025_03_51_PM.png](/images/docs/settings/google-api-integration/2025-11-26T09:26:00.000Z.png)

- Once the project is created, make sure it’s **selected** in the top navigation bar.

![Google-Cloud-console-11-10-2025_03_53_PM.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z.png)


---


**Step 2: Enable the Google Drive API**

- From the left sidebar, go to **APIs & Services → Library**.

    ![44881cb8-6ffd-4d19-8804-6c5f2bb68fdd.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-1.png)

- In the search bar, type **Google Drive API** and select it from the results.

    ![APIs-and-services--TabsyPOS--Google-Cloud-console-11-10-2025_12_14_PM.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-2.png)

- Click **Enable** to activate the Drive API for your project.

    ![Google-Drive-API--APIs-and-services--TabsyPOS--Google-Cloud-console-11-10-2025_12_16_PM.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-3.png)


---


**Step 3: Create OAuth 2.0 Credentials**

- Navigate to **APIs & Services → Credentials tab**

    ![Credentials--APIs-and-services--TabsyPOS--Google-Cloud-console-11-10-2025_12_21_PM.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-4.png)

- Click **Create Credentials → OAuth Client ID**

    ![Credentials--APIs-and-services--TabsyPOS--Google-Cloud-console-11-10-2025_12_22_PM.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-5.png)

- When prompted to create the OAuth Client ID screen, click on the **Configure Consent Screen**:

    ![64e0c9e6-078e-4351-951b-ff7787b4ef20.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-6.png)

    - Click on “Get Started”

        ![OAuth-overview--Google-Auth-Platform--My-Project-86091--Google-Cloud-console-11-10-2025_02_50_PM.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-7.png)

    - Enter the App name (e.g., TabsyPOS)
    - Provide a User support email (your Gmail ID)

        ![77012820-0791-496d-864a-155f54db5140.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-8.png)

    - Audience: Select “External”

        ![fdd6f3b5-0f63-4f37-a189-8f4eb5bd6ac5.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-9.png)

    - Contact Information: Enter your Contact Email (Your Gmail ID)

        ![1e451b9b-c1d5-4cd1-af4e-2cc5cabbc38b.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-10.png)

    - Accept Data Privacy and click on “Create”

        ![304af4b3-2df5-4feb-9795-be5273117a35.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-11.png)

- Once this is created, go to Audience and click on **Publish App**.

    ![da2d4e8c-07df-45d6-88c4-b86a4423e708.png](/images/docs/settings/google-api-integration/2025-11-28T08:21:00.000Z.png)

- Next is Create OAuth Client. To create Auth Client, go to Clients and click on “Create Client”

    ![3593fbac-5ad6-4afb-9a3e-978bbb4c6ac9.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-12.png)

- Under **Application type**, select **Web application**.

    ![460e2c60-c48d-49ff-9b32-2e24beeadd3a.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-13.png)

- Enter Name: e.g. Tabsy Web
- In the **Authorised JavaScript origins** section, add the app’s URL.
    - URL: [https://tabsy.artisanscloud.com.my](https://tabsy.artisanscloud.com.my/)
- In the **Authorised redirect URIs** section, add the app’s URL.
    - URL: [https://tabsy.artisanscloud.com.my](https://tabsy.artisanscloud.com.my/)
- Click on **Create**.

    ![Create-OAuth-client-ID--Google-Auth-Platform--Test-Project--Google-Cloud-console-11-10-2025_04_05_PM.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-14.png)


---


**Step 4: Copy and Add the Client ID**

1. After creation, your new **OAuth Client ID** will be displayed.

    ![611a45d4-83d7-473d-bc78-7a8c9765ea79.png](/images/docs/settings/google-api-integration/2025-11-17T07:14:00.000Z-15.png)

2. Copy this **Client ID**.
3. Go to **TabsyPOS → Settings → Google API Tab**
4. Paste the Client ID into the **Google Client ID** field.

---


**Step 5: Connect Your Google Drive**


Once the Client ID is saved, you can securely connect your Google account to enable backup and sync with Google Drive.


The integration will now handle file upload, backup, and restore operations directly from within TabsyPOS.


---


