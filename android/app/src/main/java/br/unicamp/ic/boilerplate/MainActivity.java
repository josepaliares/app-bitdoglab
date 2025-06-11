package br.unicamp.ic.bitdoglab;

import com.getcapacitor.BridgeActivity;
import android.os.Build;
import android.Manifest;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;

public class MainActivity extends BridgeActivity {

  @Override
  public void onStart() {
    super.onStart();

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      // Android 12+ → permissões modernas de Bluetooth
      String[] permissions = {
        Manifest.permission.BLUETOOTH_SCAN,
        Manifest.permission.BLUETOOTH_CONNECT
      };

      for (String permission : permissions) {
        if (ActivityCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
          ActivityCompat.requestPermissions(this, permissions, 0);
          break;
        }
      }

    } else {
      // Android < 12 → requer localização para usar Bluetooth
      String[] permissions = {
        Manifest.permission.ACCESS_FINE_LOCATION
      };

      for (String permission : permissions) {
        if (ActivityCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
          ActivityCompat.requestPermissions(this, permissions, 0);
          break;
        }
      }
    }
  }
}
