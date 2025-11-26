# Settings

## **Firebase Integration (For Data Syncing)**




TabsyPOS uses **Firebase** for real-time data syncing between sessions and devices. To enable this feature, you’ll need to configure your own Firebase project and connect it to TabsyPOS.


Follow the steps below to set up Firebase for your store:


---


**Step 1: Create a Firebase Project**

- Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
- Click on **Get Started**

![d3420c87-8e2c-4995-b6e5-d1b9f23acbaa.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z.png)

- Set the **Project Name**, e.g., _“TabsyPOS”_, and click **Continue**

![Create-project--Firebase-console-11-10-2025_10_33_AM.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-1.png)

- **Disable Gemini** in Firebase, as it is not needed for this setup and click **Continue**

![Create-project--Firebase-console-11-10-2025_10_36_AM.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-2.png)

- **Disable Google Analytics** in Firebase, as it is not needed for this setup and click **Create Project**

    ![Create-project--Firebase-console-11-10-2025_10_37_AM.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-3.png)

- Once your project is created, click **Continue** to proceed to the **Project Overview** page.

    ![Create-project--Firebase-console-11-10-2025_11_09_AM.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-4.png)


---


**Step 2: Create a Realtime Database**

- From the sidebar, navigate to **Build → Realtime Database and c**lick on **Create Database**

![38fc47fb-f03b-4ca2-a93b-07c0950308ca.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-5.png)

- Select your **preferred database location** and click **Next**

    ![d9efb9a9-e6c9-4b69-9403-57065ee15710.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-6.png)

- Keep **Start in Locked Mode** selected (default) and click **Enable**

    ![af1c1b5b-ed9d-491d-ab8a-57f5a9181d6d.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-7.png)


---


**Step 3: Update Database Rules**

- Once the database is created, open the **Rules** tab.
- Replace both `false` values with `true`, as shown below, and click **Publish** to save.

    ![74f63fff-3701-48f1-8968-d4675bed3c2b.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-8.png)


---


**Step 4: Add a Web App**


- From the left sidebar, go to **Project Overview → Project Settings**

    ![05e5d4f2-99c1-477b-9bc7-eaed47f7ebe2.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-9.png)

- Click on the **Web icon (</>)** under **Your Apps**

    ![TabsyPOS--Project-settings--General--Firebase-console-11-10-2025_11_11_AM.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-10.png)

- Add an **App Nickname** and click **Register App**

    ![TabsyPOS--Add-app--General--Firebase-console-11-10-2025_09_53_AM.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-11.png)

- Under ‘Add Firebase SDK’, ensure ‘Use npm’ is selected (default).
- Copy all the provided **Firebase Configuration Keys**.
- Click **Continue to Console** when done.

    ![TabsyPOS--Project-settings--General--Firebase-console-11-12-2025_10_20_AM.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-12.png)

- To view the API keys again, go to **Project Settings → Scroll Down**, and you will find them listed under **Your Apps**.

---


**Step 5: Connect Firebase to TabsyPOS**



    ![TabsyPOS-Smart-POS-System-11-10-2025_04_08_PM.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-13.png)


---

- Open **TabsyPOS → Settings → Firebase Configuration**.
- Paste all copied keys into their respective fields.
- Save the configuration to complete the setup.

---


**Step 6: View Synced Data in Firebase**


To verify that your data is syncing correctly:

- Go to **Firebase Console → Realtime Database**.
- Click on the Data Tab
- Expand the nodes under your project — you should see structured data such as product lists, transactions, or user data as synced from TabsyPOS.
- Any new data or updates in TabsyPOS will reflect here automatically after syncing.

    ![TabsyPOS--Realtime-Database--Data--Firebase-console-11-11-2025_10_17_AM.png](/images/docs/settings/firebase-integration-for-data-syncing/2025-11-17T07:14:00.000Z-14.png)


---


**Step 7: Sync Data (First-Time Setup Only)**


Once all the keys and the **Database URL** are saved, click **Sync All Data** in **TabsyPOS** to synchronise your current data with Firebase.

> **Note:** This step is required only once during the initial setup.
>
> After successful configuration, data syncing will occur **automatically** between TabsyPOS and Firebase.
>
>

Once this setup is complete, TabsyPOS will automatically sync your sales, product, and customer data through Firebase — ensuring your records remain secure and up to date.

> **Important Notes:**
>
> To ensure a smooth and conflict-free Firebase setup and synchronisation, please keep the following points in mind:
>
> - **Sync Data** needs to be performed **when Firebase configuration keys are added on a new device,** and the **Restore Data** action has not been performed.
> - Firebase configuration keys **cannot be used on multiple devices**, as this can cause **data conflicts**.
> - When sync is performed from another device, the **old data backup** will be automatically stored in Firebase.
> - The **Restore Data** option is available **only when the TabsyPOS database is empty**.
> - Always **remove the key from the first device** before performing a **Data Restore** on another device to avoid data conflicts.
>

